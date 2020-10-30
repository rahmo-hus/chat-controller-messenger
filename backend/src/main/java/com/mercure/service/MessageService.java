package com.mercure.service;

import com.mercure.dto.MessageDTO;
import com.mercure.entity.MessageEntity;
import com.mercure.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.util.*;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;

    private static final String[] colorsArray = {"#FFC194", "#FFF794", "#D2FF94", "#9DFF9", "#94FFC1",
            "#94FFF7", "#FFAFFA", "#FFAFD2", "#FFB4AF", "#FFDCAF", "#FAFFAF", "#D2FFAF"};

    private static final Map<Integer, String> colors = new HashMap<>();

    public String getRandomColor() {
        return colorsArray[new Random().nextInt(colorsArray.length)];
    }

    public MessageEntity createAndSaveMessage(int userId, int groupId, String data) {
        MessageEntity msg = new MessageEntity(userId, groupId, data);
        return messageRepository.save(msg);
    }

    public MessageEntity save(MessageEntity messageEntity) {
        return messageRepository.save(messageEntity);
    }

    public List<MessageEntity> findByGroupId(int id) {
        return messageRepository.findAllByGroupId(id);
    }

    public MessageDTO createMessageDTO(int id, int userId, String date, int group_id, String message) {
        colors.putIfAbsent(userId, getRandomColor());
        String str = userService.findUsernameById(userId);
        String[] arr = str.split(",");
        String initials = arr[0].substring(0, 1).toUpperCase() + arr[1].substring(0, 1).toUpperCase();
        String sender = StringUtils.capitalize(arr[0]) +
                " " +
                StringUtils.capitalize(arr[1]);
        return new MessageDTO(id, message, userId, group_id, sender, date, initials, colors.get(userId));
    }
}
