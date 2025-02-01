package com.websocket.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class WsChatMessage 
{
	private String sender;
	private String content;
    private String recipient; 
	private WsChatMessageType type;
	

    // Default constructor
    public WsChatMessage() 
    { }

    // All-args constructor
    public WsChatMessage(String sender,String recipient, String content, WsChatMessageType type)
    {
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.type = type;
    }

    // Getter for sender
    public String getSender() 
    {
        return sender;
    }

    // Setter for sender
    public void setSender(String sender) 
    {
        this.sender = sender;
    }
    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }
    // Getter for content
    public String getContent() 
    {
        return content;
    }

    // Setter for content
    public void setContent(String content) 
    {
        this.content = content;
    }

    // Getter for type
    public WsChatMessageType getType()
    {
        return type;
    }

    // Setter for type
    public void setType(WsChatMessageType type)
    {
        this.type = type;
    }

    // Builder pattern manually implemented (optional)
    public static class WsChatMessageBuilder 
    {
        private String sender;
        private String recipient;
        private String content;
        private WsChatMessageType type;

        public WsChatMessageBuilder sender(String sender) 
        {
            this.sender = sender;
            return this;
        }
        
        public WsChatMessageBuilder recipient(String recipient) 
        {
            this.recipient = recipient;
            return this;
        }

        public WsChatMessageBuilder content(String content) 
        {
            this.content = content;
            return this;
        }

        public WsChatMessageBuilder type(WsChatMessageType type) 
        {
            this.type = type;
            return this;
        }

        public WsChatMessage build() 
        {
            return new WsChatMessage(sender,recipient, content, type);
        }
    }

    public static WsChatMessageBuilder builder() 
    {
        return new WsChatMessageBuilder();
    }
}
//------------------------------------------
//
//package com.websocket.controller;
//
//public class WsChatMessage {
//
//    private String sender;
//    private String receiver;
//    private String content;
//    private WsChatMessageType type;
//
//    // Getters and Setters
//
//    public String getSender() {
//        return sender;
//    }
//
//    public void setSender(String sender) {
//        this.sender = sender;
//    }
//
//    public String getReceiver() {
//        return receiver;
//    }
//
//    public void setReceiver(String receiver) {
//        this.receiver = receiver;
//    }
//
//    public String getContent() {
//        return content;
//    }
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//
//    public WsChatMessageType getType() {
//        return type;
//    }
//
//    public void setType(WsChatMessageType type) {
//        this.type = type;
//    }
//}


