package org.unibl.etf.chat.service;

import org.unibl.etf.chat.entity.GroupEntity;
import org.unibl.etf.chat.entity.GroupRoleKey;
import org.unibl.etf.chat.entity.GroupUser;
import org.unibl.etf.chat.entity.UserEntity;
import org.unibl.etf.chat.repository.GroupRepository;
import org.unibl.etf.chat.utils.GroupTypeEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class GroupService {

    private static final Logger log = LoggerFactory.getLogger(GroupService.class);

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    public Integer findGroupByUrl(String url) {
        return groupRepository.findGroupByUrl(url);
    }

    public boolean checkIfUserExistsInGroup(int userId, String groupUrl) {
        Optional<GroupEntity> group = groupRepository.findByUrl(groupUrl);
        return group.filter(groupEntity -> groupRepository.userExistsInGroup(userId, groupEntity.getId()) != null).isPresent();
    }

    public void addUserToConversation(int userId, int groupId) {
        Optional<GroupEntity> groupEntity = groupRepository.findById(groupId);
        if (groupEntity.isPresent() && groupEntity.orElse(null).getGroupTypeEnum().equals(GroupTypeEnum.SINGLE)) {
            log.info("Cannot add user in a single conversation");
            return;
        }
        UserEntity user = userService.findById(userId);
        GroupUser groupUser = new GroupUser();
        groupUser.setGroupMapping(groupEntity.orElse(null));
        groupUser.setUserMapping(user);
        groupUser.setId(new GroupRoleKey(groupId, userId));
        groupUser.setRole(0);
        GroupUser saved = groupUserJoinService.save(groupUser);
        assert groupEntity.orElse(null) != null;
        groupEntity.orElse(null).getGroupUsers().add(saved);
        groupRepository.save(groupEntity.orElse(null));
    }

    public GroupUser createGroup(int userId, String name) {
        GroupUser groupUser = new GroupUser();
        GroupEntity group = new GroupEntity(name);
        group.setName(name);
        group.setUrl(UUID.randomUUID().toString());
        group.setGroupTypeEnum(GroupTypeEnum.GROUP);
        GroupEntity savedGroup = groupRepository.save(group);
        UserEntity user = userService.findById(userId);
        GroupRoleKey groupRoleKey = new GroupRoleKey();
        groupRoleKey.setUserId(userId);
        groupRoleKey.setGroupId(savedGroup.getId());
        groupUser.setId(groupRoleKey);
        groupUser.setRole(1);
        groupUser.setUserMapping(user);
        groupUser.setGroupMapping(group);
        return groupUserJoinService.save(groupUser);
    }

    public Optional<GroupEntity> findById(int groupId) {
        return groupRepository.findById(groupId);
    }

}
