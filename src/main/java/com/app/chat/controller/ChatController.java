package com.app.chat.controller;

import com.app.chat.model.Message;
import com.app.chat.model.Status;
import com.app.chat.repository.MessageRepository;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Transactional
public class ChatController {

    private final SimpMessagingTemplate simpl;
    private final MessageRepository repository;

    @Autowired
    public ChatController(SimpMessagingTemplate simpl,
                          MessageRepository repository) {
        this.simpl = simpl;
        this.repository = repository;
    }

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receivePublicMessage(@Payload Message message){
        if(message.getMessage() != null)
            repository.save(message);
        if(message.getStatus() == Status.LEAVE) {
            repository.deleteBySenderName(message.getSenderName());
        }
        return message;
    }
}
