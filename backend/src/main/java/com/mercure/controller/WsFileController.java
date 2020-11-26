package com.mercure.controller;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.entity.FileEntity;
import com.mercure.entity.MessageEntity;
import com.mercure.service.GroupService;
import com.mercure.service.MessageService;
import com.mercure.service.StorageService;
import com.mercure.utils.MessageTypeEnum;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * API controller to handle file upload
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
public class WsFileController {

    private static Logger log = LoggerFactory.getLogger(WsFileController.class);

    @Autowired
    private MessageService messageService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private StorageService storageService;

    /**
     * Receive file to put in DB and send it back to the group conversation
     *
     * @param file      The file to be uploaded
     * @param userId    int value for user ID sender of the message
     * @param groupUrl  string value for the group URL
     * @return a {@link ResponseEntity} with HTTP code
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam(name = "file") MultipartFile file, @RequestParam(name = "userId") int userId, @RequestParam(name = "groupUrl") String groupUrl) {
        FileEntity fileEntity = new FileEntity();
        int groupId = groupService.findGroupByUrl(groupUrl);
        MessageEntity messageEntity = messageService.createAndSaveMessage(userId, groupId, MessageTypeEnum.FILE.toString(), "file");
//        messageService.flush();
        storageService.store(file, messageEntity.getId());
        try {
            NotificationDTO notificationDTO = messageService.createNotificationDTO(messageEntity);
            List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);
            toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/notification/" + toUserId, notificationDTO));
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("url", fileEntity.getUrl());
            jsonObject.put("date", fileEntity.getCreatedAt());
            jsonObject.put("name", fileEntity.getFilename());
            MessageDTO dto = messageService.createMessageDTO(messageEntity.getId(), messageEntity.getType(), messageEntity.getUser_id(), messageEntity.getCreatedAt().toString(), messageEntity.getGroup_id(), jsonObject.toString());
            messagingTemplate.convertAndSend("/topic/" + groupUrl, dto);
        } catch (Exception e) {
            log.error("Cannot save file, caused by {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok().build();
    }
}
