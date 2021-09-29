package org.unibl.etf.chat.mapper;

import org.unibl.etf.chat.entity.UserEntity;
import org.unibl.etf.chat.dto.GroupDTO;
import org.unibl.etf.chat.dto.LightUserDTO;
import org.unibl.etf.chat.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserMapper {

    private Logger log = LoggerFactory.getLogger(UserMapper.class);

    @Autowired
    private GroupMapper groupMapper;

    public UserDTO toUserDTO(UserEntity userEntity) {
        // Init
        UserDTO userDTO = new UserDTO();
        List<GroupDTO> groupEntitySet = new ArrayList<>();

        // Main user infos
        userDTO.setId(userEntity.getId());
        userDTO.setFirstName(userEntity.getFirstName());
        userDTO.setLastName(userEntity.getLastName());
        userDTO.setMail(userEntity.getMail());
        userDTO.setWsToken(userEntity.getWsToken());
        // Global role
        userDTO.setRole(userEntity.getRole());
        // Spring security mapping
        userDTO.setAccountNonExpired(userEntity.isAccountNonExpired());
        userDTO.setAccountNonLocked(userEntity.isAccountNonLocked());
        userDTO.setCredentialsNonExpired(userEntity.isCredentialsNonExpired());
        userDTO.setEnabled(userEntity.isEnabled());
        userDTO.setExpiration_date(userEntity.getExpiration_date());
        userDTO.setJwt(userEntity.getJwt());
        userDTO.setAuthorities(userEntity.getAuthorities());
        userEntity.getGroupSet().forEach(groupEntity -> groupEntitySet.add(groupMapper.toGroupDTO(groupEntity)));
        userDTO.setGroupList(groupEntitySet);
        return userDTO;
    }


    public LightUserDTO toLightUserDTO(UserEntity userEntity) {
        LightUserDTO toSend = new LightUserDTO();
        toSend.setId(userEntity.getId());
        toSend.setWsToken(userEntity.getWsToken());
        toSend.setFirstName(userEntity.getFirstName());
        toSend.setLastName(userEntity.getLastName());
        return toSend;
    }
}
