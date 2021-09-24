package org.unibl.etf.chat.controller;

import org.unibl.etf.chat.service.GroupService;
import org.unibl.etf.chat.service.UserService;
import org.unibl.etf.chat.service.email.EmailService;
import org.unibl.etf.chat.dto.JwtDTO;
import org.unibl.etf.chat.dto.LightUserDTO;
import org.unibl.etf.chat.dto.VerificationRequestDTO;
import org.unibl.etf.chat.entity.GroupUser;
import org.unibl.etf.chat.entity.UserEntity;
import org.unibl.etf.chat.mapper.UserMapper;
import org.unibl.etf.chat.service.CustomUserDetailsService;
import org.unibl.etf.chat.utils.CertificateUtil;
import org.unibl.etf.chat.utils.JwtUtil;
import org.unibl.etf.chat.utils.StaticVariable;
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
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.cert.CertificateException;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin(allowCredentials = "true")
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
    private CertificateUtil certificateUtil;

    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/auth-one")
    public ResponseEntity<?> authenticateStepOne(@RequestBody JwtDTO authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword(), authenticationRequest.getCertificate());
        UserEntity user = userService.findByNameOrEmail(authenticationRequest.getUsername(), authenticationRequest.getUsername());
        emailService.sendMessage(user.getMail(), user.getWsToken());
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/verify")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody VerificationRequestDTO verificationRequest, HttpServletResponse response) throws Exception {
        String username = verificationRequest.getUsername();
        String verificationCode = verificationRequest.getVerificationCode();
        UserEntity user = userService.findByNameOrEmail(username, username);
        if(!verificationCode.equals(user.getWsToken()))
            throw new Exception("Invalid verification code");
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtTokenUtil.generateToken(userDetails);
        Cookie jwtAuthToken = new Cookie(StaticVariable.SECURE_COOKIE, token);
        jwtAuthToken.setHttpOnly(true);
        jwtAuthToken.setSecure(false);
        jwtAuthToken.setPath("/");
//        cookie.setDomain("http://localhost");
//         7 days
        jwtAuthToken.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(jwtAuthToken);
        return ResponseEntity.ok().body(userMapper.toLightUserDTO(user));
    }

    @GetMapping(value = "/logout")
    public ResponseEntity<?> fetchInformation(HttpServletResponse response) {
        Cookie cookie = new Cookie(StaticVariable.SECURE_COOKIE, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/fetch")
    public LightUserDTO fetchInformation(HttpServletRequest request) {
        return userMapper.toLightUserDTO(getUserEntity(request));
    }

    private void authenticate(String username, String password, String certificateURI) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            certificateUtil.validateCertificate(certificateURI, username);
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
        catch (CertificateException e){
            throw new Exception("INVALID_CERTIFICATE", e);
        }

    }

    @PostMapping(value = "/create")
    public String createGroupChat(HttpServletRequest request, @RequestBody String payload) throws ParseException {
        UserEntity user = getUserEntity(request);
        int userId;
        userId = user.getId();
        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(payload);
        GroupUser groupUser = groupService.createGroup(userId, (String) json.get("name"));
        return groupUser.getGroupMapping().getUrl();
    }

    private UserEntity getUserEntity(HttpServletRequest request) {
        String username;
        String jwtToken;
        UserEntity user = new UserEntity();
        Cookie cookie = WebUtils.getCookie(request, StaticVariable.SECURE_COOKIE);
        if (cookie != null) {
            jwtToken = cookie.getValue();
            username = jwtTokenUtil.getUserNameFromJwtToken(jwtToken);
            user = userService.findByNameOrEmail(username, username);
        }
        return user;
    }
}