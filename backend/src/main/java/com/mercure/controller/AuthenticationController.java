package com.mercure.controller;

import com.mercure.dto.JwtDTO;
import com.mercure.dto.MessageDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.UserEntity;
import com.mercure.mapper.UserMapper;
import com.mercure.model.JwtResponseModel;
import com.mercure.service.CustomUserDetailsService;
import com.mercure.service.GroupService;
import com.mercure.service.MessageService;
import com.mercure.service.UserService;
import com.mercure.utils.JwtUtil;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/api")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @PostMapping(value = "/auth")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtDTO authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        String token = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponseModel(token));
    }


//    @PostMapping(value = "/fetchMessages")
//    @Deprecated
//    public List<MessageDTO> fetchGroupMessages(@RequestBody String data) throws ParseException {
//        JSONParser jsonParser = new JSONParser();
//        JSONObject json = (JSONObject) jsonParser.parse(data);
//        String url = (String) json.get("id");
//        if (url != null) {
//            List<MessageDTO> messageDTOS = new ArrayList<>();
//            int groupId = groupService.findGroupByUrl(url);
//            messageService.findByGroupId(groupId).forEach(msg -> {
//                messageDTOS.add(messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage()));
//            });
//            return messageDTOS;
//        }
//        return null;
//    }

    @GetMapping(value = "/fetch")
    public UserDTO fetchInformation(HttpServletRequest request) {
        return userMapper.toUserDTO(getUserEntity(request));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @PostMapping(value = "/create")
    public ResponseEntity<?> createGroupChat(HttpServletRequest request, @RequestBody String payload) throws ParseException {
        UserEntity user = getUserEntity(request);
        int userId;
        userId = user.getId();
        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(payload);
        groupService.createGroup(userId, (String) json.get("name"));
        return ResponseEntity.ok().build();
    }

    private UserEntity getUserEntity(HttpServletRequest request) {
        String requestTokenHeader = request.getHeader("authorization");
        String username;
        String jwtToken;
        UserEntity user = new UserEntity();
        UserDTO userDTO = new UserDTO();
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            username = jwtTokenUtil.getUserNameFromJwtToken(jwtToken);
            user = userService.findByNameOrEmail(username, username);
        }
        return user;
    }
}