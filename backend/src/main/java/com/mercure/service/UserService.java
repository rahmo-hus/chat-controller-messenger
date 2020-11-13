package com.mercure.service;

import com.mercure.dto.GroupDTO;
import com.mercure.dto.LightUserDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.GroupRoleKey;
import com.mercure.entity.GroupUser;
import com.mercure.entity.UserEntity;
import com.mercure.mapper.UserMapper;
import com.mercure.repository.UserRepository;
import liquibase.pro.packaged.G;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    public void deleteAll() {
        userRepository.deleteAll();
    }

    public void flush() {
        userRepository.flush();
    }

    public void save(UserEntity userEntity) {
        userRepository.save(userEntity);
    }

    public List<LightUserDTO> fetchAllUsers() {
        List<LightUserDTO> toSend = new ArrayList<>();
        List<UserEntity> list = userRepository.findAll();
        list.forEach(user -> toSend.add(new LightUserDTO(user.getId(), user.getFirstName(), user.getLastName())));
        return toSend;
    }

    public UserEntity findByNameOrEmail(String str0, String str1) {
        return userRepository.getUserByFirstNameOrMail(str0, str1);
    }

    public boolean checkIfUserHasRightToDelete(int userId, int groupIdToCheck) {
        GroupRoleKey id = new GroupRoleKey(groupIdToCheck, userId);
        Optional<GroupUser> optional = groupUserJoinService.findById(id);
        if (optional.isPresent()) {
            GroupUser groupUser = optional.get();
            return groupUser.getRole() == 1;
        }
        return false;
    }

    public String findUsernameById(int id) {
        return userRepository.getUsernameByUserId(id);
    }

    public UserEntity findById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public String passwordEncoder(String str) {
        return passwordEncoder.encode(str);
    }

    public boolean checkIfUserNameOrMailAlreadyUsed(String firstName, String mail) {
        return userRepository.countAllByFirstNameOrMail(firstName, mail) > 0;
    }

    @Transactional
    public List<GroupDTO> getAllGroupsByUser(String username) {
        UserEntity userEntity = findByNameOrEmail(username, username);
        List<GroupDTO> toReturn = new ArrayList<>();
        userEntity.getGroupSet().forEach(group -> toReturn.add(new GroupDTO(group.getId(), group.getUrl(), group.getName())));
        return toReturn;
    }

    @Transactional
    public UserDTO getUserInformation(String username) {
        UserEntity userEntity = findByNameOrEmail(username, username);
        return userMapper.toUserDTO(userEntity);
    }
}
