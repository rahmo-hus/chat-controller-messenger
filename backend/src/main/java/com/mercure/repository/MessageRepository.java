package com.mercure.repository;

import com.mercure.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {


    @Query(value = "SELECT * FROM message m WHERE m.msg_group_id = :id",nativeQuery = true)
    List<MessageEntity> findAllByGroupId(@Param(value = "id") int id);
}
