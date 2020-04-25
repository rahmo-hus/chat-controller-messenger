package com.mercure.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FirstClassTest {

    private FirstClass test;

    public FirstClassTest(FirstClass test) {
        this.test = test;
    }

    @Test
    public void shouldCount() {
       assertEquals(5,test.count() );
    }
}