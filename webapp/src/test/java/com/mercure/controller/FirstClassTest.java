package com.mercure.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FirstClassTest {

     @Test
    public void shouldCount() {
        FirstClass temp = new FirstClass();
       assertEquals(5,temp.count() );
    }
}