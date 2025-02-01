
// import { Injectable } from '@angular/core';
// import { Client, Message } from '@stomp/stompjs';
// import { BehaviorSubject } from 'rxjs';
// import SockJS from 'sockjs-client';

// @Injectable({
//   providedIn: 'root'
// })

// export class WebsocketService 
// {

//   stompClient: Client | null = null;  // STOMP client instance to handle WebSocket connection

//   // Subject to manage the stream of incoming messages
//   private messageSubject = new BehaviorSubject<any>(null);    //This is a BehaviorSubject that keeps the latest message received from the WebSocket. The components that subscribe to messages$ will receive the latest message.  
//   public messages$ = this.messageSubject.asObservable();  // Observable for components to subscribe to messages

//   // Subject to track the connection status (connected/disconnected)
//   private connectionSubject = new BehaviorSubject<boolean>(false);    //Another BehaviorSubject that tracks whether the WebSocket connection is active or not, so components can respond to connection status changes (e.g., show a loading screen or a "connected" message).   
//   public connectionStatus$ = this.connectionSubject.asObservable();  // Observable for components to track connection status


//   connect (username:string)
//   {

//     const socket = new SockJS('http://localhost:8080/ws');  // Initialize the SockJS WebSocket connection to the server

//     // Configure the STOMP client with connection details
//     this.stompClient = new Client({
//       webSocketFactory: () => socket,  // Use SockJS as the WebSocket factory
//       reconnectDelay: 5000,  // Reconnect delay if connection is lost
//       debug: (str) => console.log(str)  // Log STOMP debug messages for troubleshooting
//     });

//     // // On successful connection
//     // this.stompClient.onConnect = (frame) => {
//     //   console.log('Connected to WebSocket server');
//     //   this.connectionSubject.next(true);  // Notify that the connection is successful

//     //   // Subscribe to the '/topic/public' topic to receive public messages
//     //   this.stompClient?.subscribe('/topic/public', (message: Message) => {
//     //     this.messageSubject.next(JSON.parse(message.body));  // Pass the message to subscribers
//     //   });

//     //   // Send a "JOIN" message to notify the server that a user has joined
//     //   this.stompClient?.publish({
//     //     destination: '/app/chat.addUser',  // Server endpoint for adding users
//     //     body: JSON.stringify({ sender: username, type: 'JOIN' })  // Send username and join event
//     //   });
//     // };

//     this.stompClient.onConnect = (frame) => {
//       console.log('Connected to WebSocket server');
//       this.connectionSubject.next(true);
    
//       // Subscribe to personal queue for private messages
//       this.stompClient?.subscribe(`/queue/${username}`, (message: Message) => {
//         this.messageSubject.next(JSON.parse(message.body));  
//       });
    
//       // Notify server that the user joined
//       this.stompClient?.publish({
//         destination: '/app/chat.addUser',
//         body: JSON.stringify({ sender: username, type: 'JOIN' })
//       });
//     };
    
//     // Handle errors reported by the STOMP broker
//     this.stompClient.onStompError = (frame) => {
//       console.error('Broker reported error: ' + frame.headers['message']);  // Log the error message
//       console.error('Additional details: ' + frame.body);  // Log additional error details
//     };
    
//     this.stompClient?.activate();
//   }


//   // sendMessage(username:string, content:string){
//   //   if (this.stompClient && this.stompClient.connected) {
//   //     // Create a chat message object
//   //     const chatMessage = { sender: username, content: content, type: 'CHAT' };

//   //     // Log the message being sent and the sender
//   //     console.log(`Message sent by ${username}: ${content}`);

//   //     // Publish (send) the message to the '/app/chat.sendMessage' destination
//   //     this.stompClient.publish({
//   //       destination: '/app/chat.sendMessage',
//   //       body: JSON.stringify(chatMessage)  // Convert the message to JSON and send
//   //     });
//   //   } else {
//   //     // Log an error if the WebSocket connection is not active
//   //     console.error('WebSocket is not connected. Unable to send message.');
//   //   }

//   // }

//   sendPrivateMessage(sender: string, recipient: string, content: string) {
//     if (this.stompClient && this.stompClient.connected) {
//       const chatMessage = { sender:sender, recipient, content:content, type: 'PRIVATE' };
  
//       console.log(`Private message sent from ${sender} to ${recipient}: ${content}`);
  
//       this.stompClient.publish({
//         destination: '/app/chat.sendPrivateMessage',
//         body: JSON.stringify(chatMessage)
//       });
//     } else {
//       console.error('WebSocket is not connected. Unable to send message.');
//     }
//   }
  

//   disconnect(){
//     if (this.stompClient) {
//       this.stompClient.deactivate();  // Deactivate the WebSocket connection
//     }
//   }
  
// } 
//-------------------------------------last

// src/app/chat.service.ts

import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
 
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private connected: boolean = false;
 
  constructor() {
    this.client = new Client({
      // Connect using SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,  // optional: auto-reconnect every 5 seconds
      debug: (str) => {
        console.log(str);
      }
    });
 
    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.connected = true;
    };
 
    this.client.activate();
  }
 
  // Subscribe to private messages for a given username
  public subscribeToMessages(username: string, callback: (message: IMessage) => void) {
    // The destination is /user/{username}/queue/messages
    return this.client.subscribe(`/user/${username}/queue/messages`, callback);
  }
 
  // Send a message via the /app/chat endpoint
  public sendMessage(message: any) {
   if (this.connected) {
    this.client.publish({
      destination: '/app/chat.sendPrivateMessage',
      body: JSON.stringify({
        sender: message.sender, // Ensure correct property names
        recipient: message.recipient,
        content: message.content,
        type: "PRIVATE"  // Ensure type is set
      })
    });
  } else {
      console.error('WebSocket connection not established');
    }
  } 
}