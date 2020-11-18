package com.mercure.controller;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.entity.FileEntity;
import com.mercure.entity.MessageEntity;
import com.mercure.service.FileService;
import com.mercure.service.GroupService;
import com.mercure.service.MessageService;
import com.mercure.utils.FileNameGenerator;
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

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    private FileNameGenerator fileNameGenerator;

    @Autowired
    private FileService fileService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Receive file to put in DB and send it back to the group conversation
     *
     * @param file The file to be uploaded
     * @param userId int value for user ID sender of the message
     * @param groupUrl string value for the group URL
     * @param extension string value for the extension of the file
     * @return a {@link ResponseEntity} with HTTP code
     * @throws IOException if the file cannot be uploaded
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam(name = "file") MultipartFile file, @RequestParam(name = "userId") int userId, @RequestParam(name = "groupUrl") String groupUrl, @RequestParam(name = "extension") String extension) throws IOException {
        FileEntity fileEntity = new FileEntity();
        String generatedFileName = fileNameGenerator.nextString();

        int groupId = groupService.findGroupByUrl(groupUrl);
        MessageEntity messageEntity = messageService.createAndSaveMessage(userId, groupId, MessageTypeEnum.FILE.toString(), "file");
        messageService.flush();

        fileEntity.setData(file.getBytes());
        fileEntity.setFilename(generatedFileName);
        fileEntity.setUrl("/" + generatedFileName + extension);
        fileEntity.setMessageId(messageEntity.getId());
        fileService.save(fileEntity);

        String FILE_NAME = "src/main/resources/public/images/" + generatedFileName + ".jpg";
        File targetFile = new File(FILE_NAME);
        try {
            Path filepath = Paths.get(targetFile.getAbsolutePath());
            file.transferTo(filepath);
            log.info("File name {} uploaded successfully.", file.getOriginalFilename());

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
