package com.mercure.spring.service;

import com.mercure.spring.dto.UserDTO;
import com.mercure.spring.entity.MyUserPrincipal;
import com.mercure.spring.entity.UserEntity;
import com.mercure.spring.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    static Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        if (s.trim().isEmpty()) {
            log.error("No username have been provided");
            throw new UsernameNotFoundException("username is empty");
        }
        UserEntity user = userRepository.findUserWithName(s);

        if (user == null) {
            log.error("User cannot be found");
            throw new UsernameNotFoundException("User " + s + " not found");
        }
        return new MyUserPrincipal(user);
    }

    public UserDTO findUserById(Long id) {
        List<UserEntity> completeList = userRepository.findAll();
        if (id != null) {
            UserEntity userEntity = completeList.stream().filter(user -> id.equals(user.getUserId())).findFirst().orElse(null);
//            Optional<UserEntity> user = userRepository.findById(Math.toIntExact(id));
            if (userEntity != null) {
                return mapToDto(userEntity);
//           return mapToDto(user.get());
            }
        }
        return null;
    }


    private List<GrantedAuthority> getGrantedAuthorities(UserEntity user) {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority("SIMPLE_USER"));
        return authorities;
    }

    private UserDTO mapToDto(UserEntity userEntity) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userEntity.getUserId());
        userDTO.setUsername(userEntity.getUsername());
        userDTO.setMail(userEntity.getEmail());
        userDTO.setAccountNonExpired(userEntity.isAccountNonExpired());
        userDTO.setAccountNonLocked(userEntity.isAccountNonLocked());
        userDTO.setCredentialsNonExpired(userEntity.isCredentialsNonExpired());
        userDTO.setEnabled(userEntity.isEnabled());
        return userDTO;
    }


    private UserEntity mapToEntity(UserDTO userDTO) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(userDTO.getId());
        userEntity.setUsername(userDTO.getUsername());
        userEntity.setEmail(userDTO.getMail());
        userEntity.setAccountNonExpired(userDTO.isAccountNonExpired());
        userEntity.setAccountNonLocked(userDTO.isAccountNonLocked());
        userEntity.setCredentialsNonExpired(userDTO.isCredentialsNonExpired());
        userEntity.setEnabled(userDTO.isEnabled());
        return userEntity;
    }


    public List<UserDTO> findAllUsers() {
       return userRepository.findAll().stream().map(user -> mapToDto(user)).collect(Collectors.toList());
    }

    public UserEntity updateUser(UserDTO dto) {
        if (dto == null) {
            log.warn("Received object is empty");
            return null;
        }
        // Chercher l'entity associée
        List<UserEntity> completeList = userRepository.findAll();
        UserEntity userEntity = completeList.stream().filter(user -> dto.getId().equals(user.getUserId())).findFirst().orElse(null);
        // Map to entity
        UserEntity entity = mapToEntity(dto);
        // Add missing fields
        entity.setUsername(userEntity.getUsername());
        entity.setEmail(userEntity.getEmail());
        entity.setPassword(userEntity.getPassword());
        log.info("Saving user {}",entity.getUsername());
        return userRepository.save(entity);
    }

}
