package com.mercure.spring.model;

public class UserModel {

    private String username;

    private String password;

    private String matchedPassword;

    private String mail;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMatchedPassword() {
        return matchedPassword;
    }

    public void setMatchedPassword(String matchedPassword) {
        this.matchedPassword = matchedPassword;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }
}
