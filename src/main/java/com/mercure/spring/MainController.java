package com.mercure.spring;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    @GetMapping("/")
    public String welcome() {
        return "Health check ok";
    }

    @GetMapping("/home")
    public String home() {
        return "Well done !";
    }
}
