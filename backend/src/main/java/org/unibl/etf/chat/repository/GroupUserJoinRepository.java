package org.unibl.etf.chat.repository;

import org.unibl.etf.chat.entity.GroupRoleKey;
import org.unibl.etf.chat.entity.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupUserJoinRepository extends JpaRepository<GroupUser, GroupRoleKey> {
}
