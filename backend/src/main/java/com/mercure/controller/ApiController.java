package com.mercure.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mercure.dto.LightUserDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.UserEntity;
import com.mercure.mapper.UserMapper;
import com.mercure.service.GroupService;
import com.mercure.service.GroupUserJoinService;
import com.mercure.service.UserService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping(value = "/api")
public class ApiController {

    private Logger log = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @GetMapping(value = "/users/all")
    public List<LightUserDTO> fetchAllUsers() {
        return userService.fetchAllUsers();
    }

    @PostMapping(value = "/users/group/all")
    public List<LightUserDTO> fetchAllUsers(@RequestBody String req) throws ParseException {
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(req);
        Long groupId = (Long) jsonObject.get("groupId");
        List<LightUserDTO> toSend = new ArrayList<>();
        UserMapper userMapper = new UserMapper();
        Optional<GroupEntity> optionalGroupEntity = groupService.findById(groupId.intValue());
        if (optionalGroupEntity.isPresent()) {
            GroupEntity group = optionalGroupEntity.get();
            Set<UserEntity> userEntities = group.getUserEntities();
            userEntities.forEach(user -> toSend.add(userMapper.toLightUserDTO(user)));
        }
        return toSend;
    }

    @GetMapping(value = "/user/add/{userId}/{groupUrl}")
    public ResponseEntity<?> addUserToConversation(@PathVariable int userId, @PathVariable String groupUrl) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        try {
            groupService.addUserToConversation(userId, groupId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error when trying to add user to conversation : {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping(value = "/user/register")
    public ResponseEntity<?> createUser(@RequestBody String data) throws ParseException {
        JSONParser jsonParser = new JSONParser();
        JSONObject json = (JSONObject) jsonParser.parse(data);
        UserEntity user = new UserEntity();
        user.setFirstName((String) json.get("firstname"));
        user.setLastName((String) json.get("lastname"));
        user.setMail((String) json.get("email"));
        user.setPassword(userService.passwordEncoder((String) json.get("password")));
        user.setRole(1);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setEnabled(true);
        try {
            log.info("User saved successfully");
            userService.save(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while registering user : {}", e.getMessage());
        }
        return ResponseEntity.status(500).build();
    }
}
