package com.mercure.entity;

import com.mercure.defense.MessageListener;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(value = MessageListener.class)
@Table(name = "message")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String message;

    @Column(name = "msg_group_id")
    private int group_id;

    @Column(name = "msg_user_id")
    private int user_id;

    @Column(name = "type")
    private String type;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    public MessageEntity(int user_id, int group_id, String type, String message){
        this.user_id = user_id;
        this.group_id = group_id;
        this.type = type;
        this.message = message;
    }

}
