package com.websocket.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.websocket.controller.WsChatMessage;
import com.websocket.controller.WsChatMessageType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j

public class WsEventListener 
{
    private static final Logger log = LoggerFactory.getLogger(WsEventListener.class);  // Use LoggerFactory directly

	private final SimpMessageSendingOperations messageSendingOperations;
	
	public WsEventListener(SimpMessageSendingOperations messageSendingOperations) 
	{
        this.messageSendingOperations = messageSendingOperations;
    }
	
	@EventListener
	public void handleWsDisconnectListener(SessionDisconnectEvent event)
	{
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String username = (String) headerAccessor .getSessionAttributes().get("username");
		
		if(username != null)
		{
			log.info("User disconnected: {} ", username);
			var message = WsChatMessage.builder()
						  .type(WsChatMessageType.LEAVE)
						  .sender(username)
						  .build();
			
			//pass the message to the broker specific topic: public
			messageSendingOperations.convertAndSend("/topic/public", message);
		}
	}
}
