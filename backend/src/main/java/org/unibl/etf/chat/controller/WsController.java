package org.unibl.etf.chat.controller;

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
import org.unibl.etf.chat.dto.GroupDTO;
import org.unibl.etf.chat.dto.MessageDTO;
import org.unibl.etf.chat.dto.NotificationDTO;
import org.unibl.etf.chat.dto.UserDTO;
import org.unibl.etf.chat.entity.MessageEntity;
import org.unibl.etf.chat.service.GroupService;
import org.unibl.etf.chat.service.GroupUserJoinService;
import org.unibl.etf.chat.service.MessageService;
import org.unibl.etf.chat.service.UserService;
import org.unibl.etf.chat.utils.ComparatorListGroupDTO;
import org.unibl.etf.chat.utils.JwtUtil;
import org.unibl.etf.chat.utils.MessageTypeEnum;

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
    public MessageDTO wsMessageMapping(@DestinationVariable int userId, @DestinationVariable String groupUrl, MessageDTO messageDTO) throws Exception {
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
