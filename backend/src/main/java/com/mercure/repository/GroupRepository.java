package com.mercure.repository;

import com.mercure.entity.GroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<GroupEntity, Integer> {

    @Query(value = "SELECT g.id FROM chat_group g WHERE g.url = :url", nativeQuery = true)
    Integer findGroupByUrl(@Param(value = "url") String url);

    List<GroupEntity> findAllById(int id);

    Optional<GroupEntity> findByUrl(String url);

    @Query(value = "SELECT group_id from group_user WHERE user_id = :user_id AND group_id = :group_id limit 1", nativeQuery = true)
    Integer userExistsInGroup(@Param(value = "user_id") int userId, @Param(value = "group_id") int groupId);
}
