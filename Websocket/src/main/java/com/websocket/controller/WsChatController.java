package com.websocket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class WsChatController 
{
	@MessageMapping("chat.sendMessage")							
	@SendTo("/topic/public")
	public WsChatMessage sendMessage(@Payload WsChatMessage msg)
	{
		System.out.println("Message received from " + msg.getSender() + ":" +msg.getContent());
		return msg;
	}
	
	@MessageMapping("chat.addUser")
	@SendTo("/topic/chat")
	public WsChatMessage addUser(@Payload WsChatMessage msg , SimpMessageHeaderAccessor headerAccessor)
	{
		headerAccessor.getSessionAttributes().put("username", msg.getSender());
		System.out.println("User joined " + msg.getSender());
		return msg;
	}
}



