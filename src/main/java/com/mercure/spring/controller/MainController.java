package com.mercure.spring.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    static Logger log = LoggerFactory.getLogger(MainController.class);

//    @GetMapping("/")
//    public String welcome() {
//        log.info("Passage par url root");
//        return "Health check ok";
//    }

    @GetMapping("/home")
    public String home() {
        log.info("Send 1 resource to path /home");
        return "Well done !";
    }
}
