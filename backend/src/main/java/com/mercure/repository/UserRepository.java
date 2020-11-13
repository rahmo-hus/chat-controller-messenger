package com.mercure.repository;

import com.mercure.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    UserEntity getUserByFirstNameOrMail(String firstName, String mail);

    @Query(value = "SELECT u.firstname, u.lastname FROM user u WHERE u.id = :userId", nativeQuery = true)
    String getUsernameByUserId(@Param(value = "userId") int id);


    int countAllByFirstNameOrMail(String firstName, String mail);
}
