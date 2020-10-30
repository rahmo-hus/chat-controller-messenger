package com.mercure.service;

import com.mercure.dto.LightUserDTO;
import com.mercure.entity.UserEntity;
import com.mercure.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public void deleteAll() {
        userRepository.deleteAll();
    }

    public void flush() {
        userRepository.flush();
    }

    public List<LightUserDTO> fetchAllUsers() {
        List<LightUserDTO> toSend = new ArrayList<>();
        List<UserEntity> list = userRepository.findAll();
        list.forEach(user -> toSend.add(new LightUserDTO(user.getId(), user.getFirstName(), user.getLastName())));
        return toSend;
    }

    public void save(UserEntity userEntity) {
        userRepository.save(userEntity);
    }

    public UserEntity findByNameOrEmail(String str0, String str1) {
        return userRepository.getUserByFirstNameOrMail(str0, str1);
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
}
