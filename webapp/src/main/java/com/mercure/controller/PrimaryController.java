package com.mercure.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PrimaryController {

    @RequestMapping("/")
    public String welcome() {
        return "health check ok";
    }

}
