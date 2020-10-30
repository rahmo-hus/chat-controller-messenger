package com.mercure.mapper;

import com.mercure.dto.LightUserDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.UserEntity;

public class UserMapper {

    public UserDTO toUserDTO(UserEntity userEntity) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userEntity.getId());
        userDTO.setFirstName(userEntity.getFirstName());
        userDTO.setLastName(userEntity.getLastName());
        userDTO.setMail(userEntity.getMail());

        userDTO.setRole(userEntity.getRole());

        userDTO.setAccountNonExpired(userEntity.isAccountNonExpired());
        userDTO.setAccountNonLocked(userEntity.isAccountNonLocked());
        userDTO.setCredentialsNonExpired(userEntity.isCredentialsNonExpired());
        userDTO.setEnabled(userEntity.isEnabled());
        userDTO.setExpiration_date(userEntity.getExpiration_date());

        userDTO.setJwt(userEntity.getJwt());
        userDTO.setGroupSet(userEntity.getGroupSet());
        userDTO.setAuthorities(userEntity.getAuthorities());
        return userDTO;
    }


    public LightUserDTO toLightUserDTO(UserEntity userEntity) {
        LightUserDTO toSend = new LightUserDTO();
        toSend.setId(userEntity.getId());
        toSend.setFirstName(userEntity.getFirstName());
        toSend.setLastName(userEntity.getLastName());
        return toSend;
    }
}
