package com.mercure.spring.service;

import com.mercure.spring.entity.UserEntity;
import com.mercure.spring.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DbInit implements CommandLineRunner {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    static Logger log = LoggerFactory.getLogger(DbInit.class);

    @Value("${spring.liquibase.enabled}")
    private boolean isEnabled;

    public DbInit(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public void run(String... args) {
        if (isEnabled) {
            log.info("Deleting all users ...");
            userRepository.deleteAll();
            userRepository.flush();
            log.info("Done");
            UserEntity user1 = new UserEntity();
            user1.setUsername("Mercure");
            user1.setPassword(passwordEncoder.encode("root"));
            user1.setEnabled(true);
            user1.setCredentialsNonExpired(true);
            user1.setAccountNonLocked(true);
            user1.setAccountNonExpired(true);
            userRepository.save(user1);
            log.info("User has been created");
            UserEntity user2 = new UserEntity();
            user2.setUsername("admin");
            user2.setPassword(passwordEncoder.encode("admin"));
            user2.setEnabled(true);
            user2.setCredentialsNonExpired(true);
            user2.setAccountNonLocked(true);
            user2.setAccountNonExpired(true);
            userRepository.save(user2);
        } else {
            log.info("I'M DOING NOTHING THIS TIME !!!!!");
        }
    }
}
