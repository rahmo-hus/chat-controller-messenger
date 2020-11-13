package com.mercure.config;

import com.google.gson.JsonObject;
import com.mercure.dto.MessageDTO;
import com.mercure.entity.MessageEntity;
import com.mercure.service.MessageService;
import com.mercure.service.UserService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

//@Component
public class SocketHandler extends TextWebSocketHandler {

    Logger log = LoggerFactory.getLogger(SocketHandler.class);

    List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    private final MessageService messageService;

    private final UserService userService;

    public SocketHandler(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage data) throws ParseException {
        log.info("Handling text message ....");
        JSONParser parser = new JSONParser();
        JSONObject request = (JSONObject) parser.parse(data.getPayload());
        Long userIdTemp = (Long) request.get("userId");
        Long groupIdTemp = (Long) request.get("groupId");
        MessageEntity msg = messageService.createAndSaveMessage(userIdTemp.intValue(), groupIdTemp.intValue(), (String) request.get("message"));
        MessageDTO messageDTO = messageService.createMessageDTO(msg.getId(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage());
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("id", messageDTO.getId());
        jsonObject.addProperty("message", messageDTO.getMessage());
        jsonObject.addProperty("userId", messageDTO.getUserId());
        jsonObject.addProperty("groupId", messageDTO.getGroupId());
        jsonObject.addProperty("sender", messageDTO.getSender());
        jsonObject.addProperty("time", messageDTO.getTime());
        jsonObject.addProperty("initials", messageDTO.getInitials());
        jsonObject.addProperty("color", messageDTO.getColor());
        TextMessage textMessage = new TextMessage(jsonObject.toString());
        sendToAllUsers(textMessage);
    }

    private void sendToAllUsers(TextMessage message) {
        sessions.forEach(session -> {
            try {
                session.sendMessage(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            log.info("UserEntity added to session");
            sessions.add(session);
//            session.sendMessage(new TextMessage("Welcome back :)"));
        } catch (Exception e) {
            log.warn("Error during adding user : {}", e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        try {
            log.info("UserEntity left session");
            sessions.remove(session);
        } catch (Exception e) {
            log.warn("Error during removing user session : {}", e.getMessage());
        }
    }
}
