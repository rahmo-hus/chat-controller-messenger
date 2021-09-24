package org.unibl.etf.chat.mapper;

import org.unibl.etf.chat.entity.GroupEntity;
import org.unibl.etf.chat.service.MessageService;
import org.unibl.etf.chat.dto.GroupDTO;
import org.unibl.etf.chat.dto.GroupMemberDTO;
import org.unibl.etf.chat.entity.GroupUser;
import org.unibl.etf.chat.entity.MessageEntity;
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
