package com.mercure.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PrimaryController {

    @RequestMapping("/")
    public String welcome() {
        return "health check ok";
    }

    @RequestMapping("/home")
    public String home() {
        return "This is the main page of spring boot application";
    }

}
