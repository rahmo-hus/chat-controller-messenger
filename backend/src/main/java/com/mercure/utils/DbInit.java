package com.mercure.utils;

import com.mercure.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DbInit implements CommandLineRunner {

    static Logger log = LoggerFactory.getLogger(DbInit.class);

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    public DbInit(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Nothing to run on DB");
//        log.info("Deleting all users ...");
//        userService.flush();
//        userService.deleteAll();
//        log.info("Done");
//        UserEntity user = new UserEntity();
//        user.setFirstName("thibaut");
//        user.setLastName("jobless");
//        user.setPassword(passwordEncoder.encode("root"));
//        user.setMail("thibaut.mouton@ecole.software.com");
//        user.setEnabled(true);
//        user.setCredentialsNonExpired(true);
//        user.setAccountNonLocked(true);
//        user.setAccountNonExpired(true);
//        user.setRole(1);
//        userService.save(user);
//        log.info("UserEntity has been created");
    }
}
