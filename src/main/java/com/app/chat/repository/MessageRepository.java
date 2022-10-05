package com.app.chat.repository;

import com.app.chat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {


    boolean existsBySenderName(String senderName);

    void deleteBySenderName(String senderName);

}
