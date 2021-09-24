package org.unibl.etf.chat.controller;

import org.unibl.etf.chat.service.GroupService;
import org.unibl.etf.chat.service.GroupUserJoinService;
import org.unibl.etf.chat.service.UserService;
import org.unibl.etf.chat.dto.GroupMemberDTO;
import org.unibl.etf.chat.dto.LightUserDTO;
import org.unibl.etf.chat.entity.GroupEntity;
import org.unibl.etf.chat.entity.GroupUser;
import org.unibl.etf.chat.entity.UserEntity;
import org.unibl.etf.chat.mapper.GroupMapper;
import org.unibl.etf.chat.mapper.GroupUserMapper;
import org.unibl.etf.chat.utils.JwtUtil;
import org.unibl.etf.chat.utils.StaticVariable;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping(value = "/api")
public class ApiController {

    private final Logger log = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private GroupMapper groupMapper;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GroupUserMapper groupUserMapper;


    @GetMapping(value = "/users/all")
    public List<LightUserDTO> fetchAllUsers() {
        return userService.fetchAllUsers();
    }


    @PostMapping(value = "/users/group/all")
    public List<GroupMemberDTO> fetchAllUsers(@RequestBody String req) throws ParseException {
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(req);
        String groupUrl = (String) jsonObject.get("groupUrl");
        List<GroupMemberDTO> toSend = new ArrayList<>();
        Integer id = groupService.findGroupByUrl(groupUrl);
        Optional<GroupEntity> optionalGroupEntity = groupService.findById(id);
        if (optionalGroupEntity.isPresent()) {
            GroupEntity group = optionalGroupEntity.get();
            Set<GroupUser> groupUsers = group.getGroupUsers();
            groupUsers.forEach(groupUser -> toSend.add(groupMapper.toGroupMemberDTO(groupUser)));
        }
        toSend.sort(Comparator.comparing(GroupMemberDTO::isAdmin).reversed());
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


    @GetMapping(value = "/user/remove/{userId}/group/{groupUrl}")
    public ResponseEntity<?> removeUserFromConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "delete");
    }

    @GetMapping(value = "/user/grant/{userId}/group/{groupUrl}")
    public ResponseEntity<?> grantUserAdminInConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "grant");
    }

    @GetMapping(value = "/user/remove/admin/{userId}/group/{groupUrl}")
    public ResponseEntity<?> removeAdminUserFromConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "removeAdmin");
    }

    @GetMapping(value = "/user/leave/{userId}/group/{groupUrl}")
    public ResponseEntity<?> leaveConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "removeUser");
    }

    private ResponseEntity<?> doUserAction(HttpServletRequest request, Integer userId, String groupUrl, String action) {
        Cookie cookie = WebUtils.getCookie(request, StaticVariable.SECURE_COOKIE);
        if (cookie == null) {
            return ResponseEntity.status(401).build();
        }
        String cookieToken = cookie.getValue();
        String username = jwtUtil.getUserNameFromJwtToken(cookieToken);
        int groupId = groupService.findGroupByUrl(groupUrl);
        UserEntity userEntity = userService.findByNameOrEmail(username, username);
        if (userEntity != null) {
            int adminUserId = userEntity.getId();
            if (action.equals("removeUser")) {
                groupUserJoinService.removeUserFromConversation(userId, groupId);
            }
            if (userService.checkIfUserHasRightToDelete(adminUserId, groupId)) {
                try {
                    if (action.equals("grant")) {
                        GroupUser groupUser = groupUserJoinService.grantUserAdminInConversation(userId, groupId);
                        return ResponseEntity.status(200).body(groupUserMapper.toGroupMemberDTO(groupUser));
                    }
                    if (action.equals("delete")) {
                        groupUserJoinService.removeUserFromConversation(userId, groupId);
                    }
                    if (action.equals("removeAdmin")) {
                        groupUserJoinService.removeUserAdminFromConversation(userId, groupId);
                    }
                } catch (Exception e) {
                    log.warn("Error during performing {} : {}", action, e.getMessage());
                    return ResponseEntity.status(500).build();
                }
            }
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping(value = "/user/register")
    public ResponseEntity<?> createUser(@RequestBody String data) throws ParseException {

        JSONParser jsonParser = new JSONParser();
        JSONObject json = (JSONObject) jsonParser.parse(data);

        // Check if there are matched in DB
        if ((userService.checkIfUserNameOrMailAlreadyUsed((String) json.get("firstname"), (String) json.get("email")))) {
            return ResponseEntity.badRequest().body("Username or mail already used, please try again");
        }
        UserEntity user = new UserEntity();
        String firstName = (String) json.get("firstname");
        String lastName = (String) json.get("lastname");
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setMail((String) json.get("email"));
        user.setPassword(userService.passwordEncoder((String) json.get("password")));
        user.setShortUrl(userService.createShortUrl(firstName, lastName));
        user.setWsToken(UUID.randomUUID().toString());
        user.setRole(1);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setEnabled(true);
        try {
            userService.save(user);
            log.info("User saved successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while registering user : {}", e.getMessage());
        }
        return ResponseEntity.status(500).build();
    }
}
