////The Config class sets up WebSocket and STOMP message broker.
//
package com.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class Config implements WebSocketMessageBrokerConfigurer
{
	@Override
	//To register the WebSocket endpoints where clients will connect.
	public void registerStompEndpoints(StompEndpointRegistry registry)
	{
		registry.addEndpoint("/ws") // Raw WebSocket endpoint
        		.setAllowedOriginPatterns("*"); // Allow all origins for development
		
		registry.addEndpoint("/ws")
//				.setAllowedOriginPatterns("http://localhost:4200")
				.setAllowedOriginPatterns("*")

				.withSockJS();
	}
	
	@Override
	//To configure the message broker for routing messages between clients.
	public void configureMessageBroker(MessageBrokerRegistry registry) 
	{
		registry.setApplicationDestinationPrefixes("/app");			// Used for routing client messages to controllers.
		registry.enableSimpleBroker("/user");						// The broker will forward messages to subscribed clients.		
	}
}
