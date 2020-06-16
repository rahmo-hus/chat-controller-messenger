package com.mercure.spring.service;

import com.mercure.spring.entity.UserEntity;
import com.mercure.spring.model.UserModel;
import com.mercure.spring.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class BasicUserService {

    static Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public UserEntity createUser(UserModel userModel) {
        if (userModel == null) {
            log.error("le model reçu est nul");
            return null;
        }
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        UserEntity createdUser = new UserEntity();
        createdUser.setUsername(userModel.getUsername());
        createdUser.setPassword(passwordEncoder.encode(userModel.getPassword()));
        createdUser.setAccountNonExpired(true);
        createdUser.setAccountNonLocked(true);
        createdUser.setEnabled(true);
        createdUser.setCredentialsNonExpired(true);
        return userRepository.save(createdUser);
    }
}
