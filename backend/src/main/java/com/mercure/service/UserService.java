package com.mercure.service;

import com.mercure.dto.LightUserDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.GroupRoleKey;
import com.mercure.entity.GroupUser;
import com.mercure.entity.UserEntity;
import com.mercure.mapper.UserMapper;
import com.mercure.repository.UserRepository;
import com.mercure.service.email.EmailService;
import com.mercure.utils.CertificateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    @Autowired
    private CertificateUtil certificateUtil;

    @Autowired
    private EmailService emailService;

    public void deleteAll() {
        userRepository.deleteAll();
    }

    public void flush() {
        userRepository.flush();
    }

    @Transactional
    public void save(UserEntity userEntity) throws Exception {
            certificateUtil.issueClientCert(userEntity.getUsername());
            emailService.sendAttachment(userEntity.getMail(), "assets/certificates/"+userEntity.getUsername()+".cer");
            userRepository.save(userEntity);
    }

    public void disableUser(int userId){
        userRepository.disableUser(userId);
    }

    public UserEntity getUser(int userId){
        return userRepository.getOne(userId);
    }

    public List<LightUserDTO> fetchAllUsers() {
        List<LightUserDTO> toSend = new ArrayList<>();
        List<UserEntity> list = userRepository.findAll();
        list.forEach(user -> toSend.add(new LightUserDTO(user.getId(), user.getFirstName(), user.getLastName())));
        return toSend;
    }

    public String findUsernameWithWsToken(String token) {
        return userRepository.getUsernameWithWsToken(token);
    }

    public UserEntity findByNameOrEmail(String str0, String str1) {
        return userRepository.getUserByFirstNameOrMail(str0, str1);
    }

    public boolean checkIfUserHasRightToDelete(int userId, int groupIdToCheck) {
        GroupRoleKey id = new GroupRoleKey(groupIdToCheck, userId);
        Optional<GroupUser> optional = groupUserJoinService.findById(id);
        if (optional.isPresent()) {
            GroupUser groupUser = optional.get();
            return groupUser.getRole() == 1;
        }
        return false;
    }

    public String createShortUrl(String firstName, String lastName) {
        StringBuilder sb = new StringBuilder();
        sb.append(firstName);
        sb.append(".");
        sb.append(Normalizer.normalize(lastName.toLowerCase(), Normalizer.Form.NFD));
        boolean isShortUrlAvailable = true;
        int counter = 0;
        while (isShortUrlAvailable) {
            sb.append(counter);
            if (userRepository.countAllByShortUrl(sb.toString()) == 0) {
                isShortUrlAvailable = false;
            }
            counter++;
        }
        return sb.toString();
    }

    public String findUsernameById(int id) {
        return userRepository.getUsernameByUserId(id);
    }

    public UserEntity findById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public String passwordEncoder(String str) {
        return passwordEncoder.encode(str);
    }

    public boolean checkIfUserNameOrMailAlreadyUsed(String firstName, String mail) {
        return userRepository.countAllByFirstNameOrMail(firstName, mail) > 0;
    }


    /**
     * At WebSocket init, fetch user data and map it to a {@link UserDTO}
     *
     * @param username string value for username
     * @return a {@link UserDTO}
     */
    @Transactional
    public UserDTO getUserInformation(String username) {
        UserEntity userEntity = findByNameOrEmail(username, username);
        return userMapper.toUserDTO(userEntity);
    }
}
