package com.mercure.controller;

import com.mercure.dto.GroupDTO;
import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.MessageEntity;
import com.mercure.service.GroupService;
import com.mercure.service.GroupUserJoinService;
import com.mercure.service.MessageService;
import com.mercure.service.UserService;
import com.mercure.utils.ComparatorListGroupDTO;
import com.mercure.utils.JwtUtil;
import com.mercure.utils.MessageTypeEnum;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@CrossOrigin
public class WsController {

    private final Logger log = LoggerFactory.getLogger(WsController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public String testRoute(HttpServletRequest request) {
        String requestTokenHeader = request.getHeader("authorization");
        if (StringUtils.isEmpty(requestTokenHeader)) {
            return null;
        }
        return jwtUtil.getUserNameFromJwtToken(requestTokenHeader.substring(7));
    }

    @MessageMapping("/message")
    @SendToUser("/queue/reply")
    public List<GroupDTO> initUserProfile(String token) {
        String username = userService.findUsernameWithWsToken(token);
        if (StringUtils.isEmpty(username)) {
            log.warn("Username not found");
            return null;
        }
        UserDTO user = userService.getUserInformation(username);
        List<GroupDTO> toReturn = user.getGroupList();
        toReturn.sort(new ComparatorListGroupDTO());
        return toReturn;
    }

    @MessageMapping("/message/text/{userId}/group/{groupUrl}")
    @SendTo("/topic/{groupUrl}")
    public MessageDTO wsMessageMapping(@DestinationVariable int userId, @DestinationVariable String groupUrl, MessageDTO messageDTO) {
        Integer groupId = groupService.findGroupByUrl(groupUrl);
        MessageEntity messageEntity = new MessageEntity(userId, groupId, MessageTypeEnum.TEXT.toString(), messageDTO.getMessage());
        MessageEntity msg;
        try {
            msg = messageService.save(messageEntity);
        } catch (Throwable e) {
            if (e.getMessage().toLowerCase(Locale.ROOT).contains("dos") || e.getMessage().contains("SQL")) {
                messageEntity = new MessageEntity(1, groupId, MessageTypeEnum.TEXT.toString(), "User " + userService.findUsernameById(userId) + " has been banned");
                msg = messageService.save(messageEntity);
                NotificationDTO notificationDTO = messageService.createNotificationDTO(msg);
                List<Integer> toSend = messageService.createNotificationList(1, groupUrl);
                toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/notification/" + toUserId, notificationDTO));
                groupUserJoinService.removeUserFromConversation(userId, groupId);
                return messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage());
            } else
                msg = null;
        }
        NotificationDTO notificationDTO = messageService.createNotificationDTO(msg);
        List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);
        toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/notification/" + toUserId, notificationDTO));
        return messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage());
    }

    @MessageMapping("/message/call/{userId}/group/{groupUrl}")
    @SendTo("/topic/call/reply/{groupUrl}")
    public String wsCallMessageMapping(@DestinationVariable int userId, String req) throws ParseException {
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(req);
        log.info("Receiving RTC data, sending back to user ...");
        JSONObject json = new JSONObject();
        try {
            json.put("userIn", userId);
            json.put("rtc", jsonObject);
        } catch (Exception e) {
            log.info(String.valueOf(json));
            log.info("Error during JSON creation : {}", e.getMessage());
        }
        return req;
    }

    @SubscribeMapping("/groups/get/{url}")
    public List<MessageDTO> findOne(@DestinationVariable(value = "url") String urlAndUserId) {
        if (urlAndUserId != null) {
            String url = urlAndUserId.split("&")[0];
            Integer userId = Integer.parseInt(urlAndUserId.split("&")[1]);
            if (groupService.checkIfUserExistsInGroup(userId, url)) {
                List<MessageDTO> messageDTOS = new ArrayList<>();
                int groupId = groupService.findGroupByUrl(url);
                messageService.findByGroupId(groupId).forEach(msg -> {
                    messageDTOS.add(messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage()));
                });
                return messageDTOS;
            }
        }
        return null;
    }
}
