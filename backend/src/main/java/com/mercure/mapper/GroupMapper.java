package com.mercure.mapper;

import com.mercure.dto.GroupDTO;
import com.mercure.dto.GroupMemberDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.GroupUser;
import com.mercure.entity.MessageEntity;
import com.mercure.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupMapper {

    @Autowired
    private MessageService messageService;

    public GroupDTO toGroupDTO(GroupEntity grp) {
        GroupDTO grpDTO = new GroupDTO();
        grpDTO.setId(grp.getId());
        grpDTO.setName(grp.getName());
        grpDTO.setUrl(grp.getUrl());
        grpDTO.setGroupType(grp.getGroupTypeEnum().toString());
        MessageEntity msg = messageService.findLastMessage(grp.getId());
        if (msg != null) {
            grpDTO.setLastMessage(msg.getMessage());
            grpDTO.setLastMessageDate(msg.getCreatedAt().toString());
            grpDTO.setLastMessageSeen(false);
        }
        return grpDTO;
    }

    public GroupMemberDTO toGroupMemberDTO(GroupUser groupUser) {
        GroupMemberDTO groupMemberDTO = new GroupMemberDTO();
        groupMemberDTO.setFirstName(groupUser.getUserMapping().getFirstName());
        groupMemberDTO.setLastName(groupUser.getUserMapping().getLastName());
        groupMemberDTO.setUserId(groupUser.getUserMapping().getId());
        groupMemberDTO.setAdmin(groupUser.getRole() == 1);
        return groupMemberDTO;
    }
}
