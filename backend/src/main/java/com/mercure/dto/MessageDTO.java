package com.mercure.dto;

public class MessageDTO {

    public MessageDTO() {
    }

    public MessageDTO(int id, String message, int userId, int groupId, String sender, String time, String initials, String color) {
        this.id = id;
        this.message = message;
        this.userId = userId;
        this.groupId = groupId;
        this.sender = sender;
        this.time = time;
        this.initials = initials;
        this.color = color;
    }

    private int id;

    private String message;

    private int userId;

    private int groupId;

    private String sender;

    private String time;

    private String initials;

    private String color;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
