package com.mercure.spring.repository;

import com.mercure.spring.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    @Query("select u from UserEntity u " +" where u.username = ?1")
    UserEntity findUserWithName(String username);

//    UPDATE table
//    SET colonne_1 = 'valeur 1', colonne_2 = 'valeur 2', colonne_3 = 'valeur 3'
//    WHERE condition
    @Query("UPDATE UserEntity u SET u.enabled = :userEntity")
    UserEntity updateUser(UserEntity userEntity);
}
