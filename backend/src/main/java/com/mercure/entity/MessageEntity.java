package com.mercure.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "message")
public class MessageEntity {

    public MessageEntity() {
    }

    public MessageEntity(int userId, int groupId, String message) {
        this.user_id = userId;
        this.group_id = groupId;
        this.message = message;
    }

    @Id
    private int id;

    private String message;

    @Column(name = "msg_group_id")
    private int group_id;

    @Column(name = "msg_user_id")
    private int user_id;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

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

    public int getGroup_id() {
        return group_id;
    }

    public void setGroup_id(int group_id) {
        this.group_id = group_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
