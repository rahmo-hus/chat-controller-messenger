package com.mercure.controller;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.FileEntity;
import com.mercure.entity.MessageEntity;
import com.mercure.service.GroupService;
import com.mercure.service.MessageService;
import com.mercure.service.UserService;
import com.mercure.utils.FileNameGenerator;
import com.mercure.utils.JwtUtil;
import com.mercure.utils.MessageTypeEnum;
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

@RestController
@CrossOrigin
public class WsController {

    private Logger log = LoggerFactory.getLogger(WsController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private FileNameGenerator fileNameGenerator;

    @GetMapping
    public String testRoute(HttpServletRequest request) {
        String requestTokenHeader = request.getHeader("authorization");
        if (StringUtils.isEmpty(requestTokenHeader)) {
            return null;
        }
        return jwtUtil.getUserNameFromJwtToken(requestTokenHeader.substring(7));
    }

    /**
     * Used this to retrieve user information (without password)
     * and all groups attached to the user
     *
     * @param token the String request from client
     * @return {@link UserDTO}
     */
    @MessageMapping("/message")
    @SendToUser("/queue/reply")
    public UserDTO initUserProfile(String token) {
        String username = userService.findUsernameWithWsToken(token);
        if (StringUtils.isEmpty(username)) {
            log.warn("Username not found");
            return null;
        }
        return userService.getUserInformation(username);
    }


    /**
     * Receive message from user and dispatch to all users subscribed to conversation
     *
     * @param userId     the int userId for mapping message to a user
     * @param groupUrl   the string groupUrl for mapping message to a group
     * @param messageDTO the payload received
     * @return a messageDTO with all informations
     */
    @MessageMapping("/message/text/{userId}/group/{groupUrl}")
    @SendTo("/topic/{groupUrl}")
    public MessageDTO wsMessageMapping(@DestinationVariable int userId, @DestinationVariable String groupUrl, MessageDTO messageDTO) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        MessageEntity messageEntity = new MessageEntity(userId, groupId, MessageTypeEnum.TEXT.toString(), messageDTO.getMessage());
        MessageEntity msg = messageService.save(messageEntity);
        NotificationDTO notificationDTO = messageService.createNotificationDTO(msg);
        List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);
        toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/notification/" + toUserId, notificationDTO));
        return messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage());
    }

    /**
     * Allow to handle binary files, typically when user send image.
     * However, this method can't work because STOMPJS does not support binary data
     *
     * @param userId int value for userID
     * @param groupUrl string value for group URL
     * @param binaryMessage byte data
     * @return a {@link MessageDTO}
     */
    @MessageMapping("/message/blob/{userId}/group/{groupUrl}")
    @SendTo("/topic/{groupUrl}")
    @Deprecated
    public MessageDTO wsBinaryMessageMapping(@DestinationVariable int userId, @DestinationVariable String groupUrl, byte[] binaryMessage) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        String fileName = fileNameGenerator.getRandomString();
        MessageEntity messageEntity = new MessageEntity(userId, groupId, MessageTypeEnum.FILE.toString(), "text");
        MessageEntity msg = messageService.save(messageEntity);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilename(fileName);
        fileEntity.setMessageId(msg.getId());

        NotificationDTO notificationDTO = messageService.createNotificationDTO(msg);
        List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);
        toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/notification/" + toUserId, notificationDTO));
        return messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage());
    }

    /**
     * Return history of group discussion
     *
     * @param url The group url to map
     * @return List of message
     */
    @SubscribeMapping("/groups/get/{url}")
    public List<MessageDTO> findOne(@DestinationVariable String url) {
//        log.info("Subscription to topic {}", url);
        if (url != null) {
            List<MessageDTO> messageDTOS = new ArrayList<>();
            int groupId = groupService.findGroupByUrl(url);
            messageService.findByGroupId(groupId).forEach(msg -> {
                messageDTOS.add(messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage()));
            });
            return messageDTOS;
        }
        return null;
    }
}
