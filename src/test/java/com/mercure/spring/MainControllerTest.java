package com.mercure.spring;

import com.mercure.spring.controller.MainController;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MainControllerTest {

//    @Test
//    void welcome() {
//        MainController mainController = new MainController();
//        assertEquals("Health check ok", mainController.welcome());
//    }

    @Test
    void home() {
        MainController mainController = new MainController();
        assertEquals("Well done !", mainController.home());
    }
}