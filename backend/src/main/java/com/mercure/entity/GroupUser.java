package com.mercure.entity;

import javax.persistence.*;

@Entity
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

    int role;

    public GroupRoleKey getId() {
        return id;
    }

    public void setId(GroupRoleKey id) {
        this.id = id;
    }

    public GroupEntity getGroupMapping() {
        return groupMapping;
    }

    public void setGroupMapping(GroupEntity groupMapping) {
        this.groupMapping = groupMapping;
    }

    public UserEntity getUserMapping() {
        return userMapping;
    }

    public void setUserMapping(UserEntity userMapping) {
        this.userMapping = userMapping;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }
}
