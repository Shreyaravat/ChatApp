//-------------last--------------------
// import { Component, OnInit } from '@angular/core';
// import { WebsocketService } from './services/websocket.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent implements OnInit {

//   title = 'frontend';
//   username: string = '';  // Stores the username entered by the user
//   recipient: string = ''; // Stores recipient for private messages
//   message: string = '';  // Stores the message being typed by the user
//   messages: any[] = [];  // Stores all the chat messages
//   isConnected = false;  // Tracks whether the user is connected to the WebSocket
//   connectingMessage = 'Connecting...';  // Message to show while connecting
//   sentMessages: any[] = [];  // Array to store sent messages

//   constructor(private websocketService: WebsocketService) {
//     console.log('AppComponent constructor called');  
//   }

//   // ngOnInit(): void {
//   //   this.websocketService.messages$.subscribe((message: any) => {
//   //     if (message) {
//   //       console.log('Received message:', message);
    
//   //       // Add the message to the messages array
//   //       this.messages.push(message);
//   //     }
//   //   });
//   ngOnInit(): void {
//     this.websocketService.messages$.subscribe((message: any) => {
//       if (message) {
//         console.log('Received message:', message);
      
//         // Add the message to the messages array
//         this.messages.push(message);
  
//         // Add this condition to ensure private messages are added to the messages array
//         if (message.type === 'PRIVATE' && message.recipient === this.username) {
//           this.messages.push(message);
//         }
//         if (message.from === this.username || message.to === this.username) {
//           this.sentMessages.push(message);
//         }
//       }
//     });
    

//     // this.websocketService.messages$.subscribe((message: { sender: any; recipient: any; content: any; }) => {
//     //   if (message) {
//     //     console.log(`Message received from ${message.sender} to ${message.recipient}: ${message.content}`);
  
//     //     // Show messages only meant for this user
//     //     // if (message.recipient === this.username || message.sender === this.username) {
//     //     //   this.messages.push(message);
//     //     // }
//     //     if (
//     //       message.recipient === this.username || 
//     //       message.sender === this.username || 
//     //       message.recipient === 'all' // Ensuring public messages are included
//     //     ) {
//     //       this.messages.push(message);
//     //     }
//     //   }
//     // });

//     this.websocketService.connectionStatus$.subscribe((connected: boolean) => {
//       this.isConnected = connected;
//       if (connected) {
//         this.connectingMessage = '';
//         console.log('WebSocket connection established');
//       }
//     });
//   }

//   connect() {
//     console.log('Attempting to connect with username:', this.username);
//     this.websocketService.connect(this.username);
//   }

//   // sendPrivateMessage() {
//   //   if (this.message && this.recipient) {
//   //     this.websocketService.sendPrivateMessage(this.username, this.recipient, this.message);
//   //     this.message = ''; // Clear input field after sending
//   //   }
//   // }
//   sendPrivateMessage() {
//     if (this.message.trim() && this.recipient.trim()) {
//       const chatMessage = {
//         sender: this.username,
//         recipient: this.recipient,
//         content: this.message,
//         timestamp: new Date().getTime()
//       };
   
//       // Log the message for debugging
//       console.log("Sending Message: ", chatMessage);
   
//       // Optional: Display the sent message locally (echo)
// // Add the message to the sentMessages array (local echo)
//   this.sentMessages.push(chatMessage);   
//       // Send the message to the server via WebSocket
//       this.websocketService.sendMessage(chatMessage);
   
//       // Clear the message input
//       this.message = '';
//     }
//     else {
//       console.error('WebSocket not connected or message/recipient is empty');
//     }
//   }
//   getAvatarColor(sender: string): string {
//     const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
//     let hash = 0;
//     for (let i = 0; i < sender.length; i++) {
//       hash = 31 * hash + sender.charCodeAt(i);
//     }
//     return colors[Math.abs(hash % colors.length)];
//   }
// }
//-----------------last------------


import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IMessage } from '@stomp/stompjs';
 
@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  username: string = '';
  recipient: string = '';
  isConnected = false;
  connectingMessage = 'Connecting...';
  messageContent: string = '';
  messages: any[] = [];

 
  isChatStarted: boolean = false;
 
  constructor(private chatService: WebsocketService) {}
 
  initChat() {
     console.log("initChat() called! ");
    // Check if the username is valid
    if (this.username.trim().length < 2) {
      alert('Username must be at least 2 characters long.');
      return;
    }
    this.isChatStarted = true;
 
    // Subscribe to the sender's own messages
    this.chatService.subscribeToMessages(this.username, (message: IMessage) => {
      const body = JSON.parse(message.body);
      this.messages.push(body);
    });
 
    // Subscribe to the recipient's messages after sending the message
    if (this.recipient) {
      this.chatService.subscribeToMessages(this.recipient, (message: IMessage) => {
        const body = JSON.parse(message.body);
        this.messages.push(body);
      });
    }
  }
 
 
  // Send message method
  sendMessage() {
    if (this.messageContent.trim() && this.recipient.trim()) {
      const chatMessage = {
        sender: this.username,
        recipient: this.recipient,
        content: this.messageContent,
        timestamp: new Date().getTime()
      };
 
      // Log the message for debugging
      console.log("Sending Message: ", chatMessage);
 
      // Optional: Display the sent message locally (echo)
      this.messages.push(chatMessage);
 
      // Send the message to the server via WebSocket
      this.chatService.sendMessage(chatMessage);
 
      // Clear the message input
      this.messageContent = '';
    }
  }
  getAvatarColor(sender: string): string {
        const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
        let hash = 0;
        for (let i = 0; i < sender.length; i++) {
          hash = 31 * hash + sender.charCodeAt(i);
        }
        return colors[Math.abs(hash % colors.length)];
      }
}
 