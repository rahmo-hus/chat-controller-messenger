package com.mercure.service;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.MessageEntity;
import com.mercure.repository.MessageRepository;
import com.mercure.utils.MessageTypeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class MessageService {

    private static final String[] colorsArray =
            {
                    "#FFC194", "#D2FF94", "#9DFF9", "#94FFC1",
                    "#94FFF7", "#FFAFFA", "#FFAFD2", "#FFB4AF",
                    "#FFDCAF", "#FAFFAF", "#D2FFAF"
            };
    private static final Map<Integer, String> colors = new HashMap<>();
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private GroupService groupService;

    public String getRandomColor() {
        return colorsArray[new Random().nextInt(colorsArray.length)];
    }

    public MessageEntity createAndSaveMessage(int userId, int groupId, String type, String data) {
        MessageEntity msg = new MessageEntity(userId, groupId, type, data);
        return messageRepository.save(msg);
    }

    public void flush() {
        messageRepository.flush();
    }

    public MessageEntity save(MessageEntity messageEntity) {
        return messageRepository.save(messageEntity);
    }

    public List<MessageEntity> findByGroupId(int id) {
        return messageRepository.findAllByGroupId(id);
    }

    public MessageEntity findLastMessage(int groupId) {
        return messageRepository.findLastMessageByGroupId(groupId);
    }

    public MessageDTO createMessageDTO(int id, String type, int userId, String date, int group_id, String message) {
        colors.putIfAbsent(userId, getRandomColor());
        String str = userService.findUsernameById(userId);
        String messageToReturn = null;
        String[] arr = str.split(",");
        String initials = arr[0].substring(0, 1).toUpperCase() + arr[1].substring(0, 1).toUpperCase();
        String sender = StringUtils.capitalize(arr[0]) +
                " " +
                StringUtils.capitalize(arr[1]);
        if (type.equals(MessageTypeEnum.TEXT.toString())) {
            messageToReturn = message;
        }
        return new MessageDTO(id, type, messageToReturn, userId, group_id, null, sender, date, initials, colors.get(userId));
    }

    @Transactional
    public List<Integer> createNotificationList(int userId, String groupUrl) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        List<Integer> toSend = new ArrayList<>();
        Optional<GroupEntity> optionalGroupEntity = groupService.findById(groupId);
        if (optionalGroupEntity.isPresent()) {
            GroupEntity groupEntity = optionalGroupEntity.get();
//            groupEntity.getUserEntities().stream().filter(user -> user.getId() != userId).forEach(userEntity -> toSend.add(userEntity.getId()));
            groupEntity.getUserEntities().forEach(userEntity -> toSend.add(userEntity.getId()));
        }
        return toSend;
    }

    public NotificationDTO createNotificationDTO(MessageEntity msg) {
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setGroupId(msg.getGroup_id());
        if (msg.getType().equals(MessageTypeEnum.TEXT.toString())) {
            notificationDTO.setMessage(msg.getMessage());
        }
        notificationDTO.setFromUserId(msg.getUser_id());
        notificationDTO.setLastMessageDate(msg.getCreatedAt().toString());
        notificationDTO.setSenderName(userService.findUsernameById(msg.getUser_id()));
        return notificationDTO;
    }
}
