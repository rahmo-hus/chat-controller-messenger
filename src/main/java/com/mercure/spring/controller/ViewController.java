package com.mercure.spring.controller;

import com.mercure.spring.dto.UserDTO;
import com.mercure.spring.entity.UserEntity;
import com.mercure.spring.model.UserModel;
import com.mercure.spring.service.BasicUserService;
import com.mercure.spring.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class ViewController {

    static Logger log = LoggerFactory.getLogger(ViewController.class);

    @Autowired
    private BasicUserService basicUserService;

    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationContext applicationContext;

    @GetMapping
    public String index(HttpServletRequest httpServletRequest, Model model) {
        Principal principal = httpServletRequest.getUserPrincipal();
        String rootUrl = applicationContext.getApplicationName();
        model.addAttribute("context", rootUrl);
        model.addAttribute("user", principal);
        return "fragment/header";
    }

    @GetMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("userModel", new UserModel());
        return "login";
    }

    @GetMapping("/secret")
    public String secret() {
        return "secret";
    }

    @GetMapping("/denied")
    public String denied() {
        return "denied";
    }

    @GetMapping("/auth/admin")
    public String saveUser(Model model) {
        model.addAttribute("userModel", new UserModel());
        log.info("Ajout du model UserModel dans la vue");
        return "createUser";
//        return "createUser :: #header";
    }

    @GetMapping("/auth/manage")
    public String manageUsers(Model model) {
        List<UserDTO> userDTOS = userService.findAllUsers();
        model.addAttribute("userList", userDTOS);
        return "manageUser";
    }

    @PostMapping("/save")
    public String createUser(@ModelAttribute UserModel userModel, Model model) {
        List<String> errorList = new ArrayList<>();
        if (StringUtils.isEmpty(userModel.getUsername())) {
            errorList.add("Username field is required");
        }
        if (StringUtils.isEmpty(userModel.getMail())) {
            errorList.add("Mail field is required");
        }
        if (StringUtils.isEmpty(userModel.getPassword()) || StringUtils.isEmpty(userModel.getMatchedPassword())) {
            errorList.add("Password field is required");
        }
        String chosenPassword = userModel.getPassword();
        String matchedPassword = userModel.getMatchedPassword();
        if (chosenPassword != null && matchedPassword != null && !chosenPassword.equals(matchedPassword)) {
            errorList.add("Password do not match");
        }
        if (!CollectionUtils.isEmpty(errorList)) {
            model.addAttribute("errorList", errorList);
            model.addAttribute("userModel", new UserModel());
            return "createUser";
        }

        if (userModel != null) {
            UserEntity newUser = basicUserService.createUser(userModel);
            model.addAttribute("newUser", newUser);
            model.addAttribute("userModel", new UserModel());
        }
        return "createUser";
    }


    @PostMapping("/auth/user/edit")
    public String manageUsers(@ModelAttribute UserDTO userDTO) {
        if (userDTO != null) {
            userService.updateUser(userDTO);
        }
        return "redirect:/auth/manage";
    }


}
