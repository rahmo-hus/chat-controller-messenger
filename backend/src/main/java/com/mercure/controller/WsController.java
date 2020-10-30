package com.mercure.controller;

import com.mercure.entity.UserEntity;
import com.mercure.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class WsController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public String testRoute() {
        return "OK";
    }

    @GetMapping(value = "/manual")
    public String wsStatus() {
//        UserEntity user = new UserEntity();
//        user.setFirstName("thibaut");
//        user.setLastName("jobles2121s");
//        user.setPassword(passwordEncoder.encode("root"));
//        user.setMail("thibaut1@ecole.software.com");
//        user.setEnabled(true);
//        user.setCredentialsNonExpired(true);
//        user.setAccountNonLocked(true);
//        user.setAccountNonExpired(true);
//        user.setRole(1);
//        userService.save(user);
        UserEntity user1 = new UserEntity();
        user1.setFirstName("guillaume");
        user1.setLastName("mouton1");
        user1.setPassword(passwordEncoder.encode("root"));
        user1.setMail("thibaut242542on@ecole.software.com");
        user1.setEnabled(true);
        user1.setCredentialsNonExpired(true);
        user1.setAccountNonLocked(true);
        user1.setAccountNonExpired(true);
        user1.setRole(1);
        userService.save(user1);
        UserEntity user2 = new UserEntity();
        user2.setFirstName("pauline");
        user2.setLastName("mouto212n");
        user2.setPassword(passwordEncoder.encode("root"));
        user2.setMail("thibaut2mouton@ecole.software.com");
        user2.setEnabled(true);
        user2.setCredentialsNonExpired(true);
        user2.setAccountNonLocked(true);
        user2.setAccountNonExpired(true);
        user2.setRole(1);
        userService.save(user2);
        return "OK";
    }

}
