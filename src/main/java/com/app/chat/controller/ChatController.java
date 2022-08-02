package com.app.chat.controller;

import com.app.chat.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ChatController {

    private final SimpMessagingTemplate simpl;

    @Autowired
    public ChatController(SimpMessagingTemplate simpl) {
        this.simpl = simpl;
    }

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receivePublicMessage(@Payload Message message){
        return message;
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message){
        simpl.convertAndSendToUser(message.getReceiverName(),"/private",message);
        System.out.println(message.getMessage());
        return message;
    }

}
