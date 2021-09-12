package com.mercure.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "group_user")
public class GroupUser {

    @EmbeddedId
    GroupRoleKey id;

    @ManyToOne
    @MapsId("groupId")
    @JoinColumn(name = "group_id")
    GroupEntity groupMapping;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    UserEntity userMapping;

    private int role;

}
