
package com.websocket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class WsChatController 
{
    private final SimpMessagingTemplate messagingTemplate;

    // Inject SimpMessagingTemplate
    public WsChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
	
	@MessageMapping("chat.sendPrivateMessage")
	public void sendPrivateMessage(@Payload WsChatMessage msg) 
    {
	    System.out.println("Private Message from " + msg.getSender() + " to " + msg.getRecipient() + ": " + msg.getContent());

	    // Send message only to the recipient's queue
//	    String destination = "/queue/" + msg.getRecipient();
//	    messagingTemplate.convertAndSend(destination, msg);
//	    messagingTemplate.convertAndSendToUser(msg.getRecipient(), "/queue/messages", msg);
	    if (msg.getType() == WsChatMessageType.PRIVATE) {
	        messagingTemplate.convertAndSendToUser(
	            msg.getRecipient(), 
	            "/queue/messages", 
	            msg
	        );
	    }

	}
//    @MessageMapping("/chat.sendPrivateMessage")
//    @SendToUser("/queue/messages")
//    public WsChatMessage sendPrivateMessage(@Payload WsChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
//	    System.out.println("Private Message from " + chatMessage.getSender() + " to " + chatMessage.getRecipient() + ": " + chatMessage.getContent());
//
//    	return chatMessage; // This sends the message back to the recipient
//    }


	
	@MessageMapping("chat.addUser")
	@SendTo("/topic/chat")
	public WsChatMessage addUser(@Payload WsChatMessage msg , SimpMessageHeaderAccessor headerAccessor)
	{
		headerAccessor.getSessionAttributes().put("username", msg.getSender());
		System.out.println("User joined " + msg.getSender());
		return msg;
	}
}
//------------------------------------------------------
//package com.websocket.controller;
//
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class WsChatController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    public WsChatController(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    @MessageMapping("/sendMessage") // For sending messages from clients
//    public void sendMessage(WsChatMessage message) {
//        if (message.getType() == WsChatMessageType.CHAT) {
//            String destination = "/queue/" + message.getReceiver(); // Direct message to receiver
//            messagingTemplate.convertAndSend(destination, message);
//        }
//    }
//}

