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
	private WsChatMessageType type;
	

    // Default constructor
    public WsChatMessage() 
    { }

    // All-args constructor
    public WsChatMessage(String sender, String content, WsChatMessageType type)
    {
        this.sender = sender;
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
        private String content;
        private WsChatMessageType type;

        public WsChatMessageBuilder sender(String sender) 
        {
            this.sender = sender;
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
            return new WsChatMessage(sender, content, type);
        }
    }

    public static WsChatMessageBuilder builder() 
    {
        return new WsChatMessageBuilder();
    }
}





