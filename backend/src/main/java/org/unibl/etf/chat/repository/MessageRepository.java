package org.unibl.etf.chat.repository;

import org.unibl.etf.chat.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {

    @Query(value = "SELECT * FROM message m WHERE m.msg_group_id = :id", nativeQuery = true)
    List<MessageEntity> findAllByGroupId(@Param(value = "id") int id);

    @Query(value = "SELECT * FROM message m1 INNER JOIN (SELECT MAX(m.id) as id FROM message m GROUP BY m.msg_group_id) temp ON temp.id = m1.id WHERE msg_group_id = :idOfGroup", nativeQuery = true)
    MessageEntity findLastMessageByGroupId(@Param(value = "idOfGroup") int groupId);

    @Query(value = "SELECT * from message where msg_user_id = :idOfUser order by id desc limit 1 ;", nativeQuery = true)
    MessageEntity findLastMessageByUserId(@Param(value="idOfUser") int userId);

}
