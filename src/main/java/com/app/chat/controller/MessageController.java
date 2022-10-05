package com.app.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.chat.model.Message;
import com.app.chat.repository.MessageRepository;

@RestController
@RequestMapping("/")
public class MessageController{

    @Autowired
    private MessageRepository repository;

    @GetMapping("messages")
    public List<Message> findAllMessages(){
        return repository.findAll();
    }
}