import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../Utils/WebSocketService';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class MessagingComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string = localStorage.getItem('userId') || ''; // Current user ID

  constructor(private wsService: WebsocketService,private http:HttpClient) {}

  ngOnInit(): void {

    this.wsService.getUsers(this.currentUserId).subscribe((userList) => {
        this.users = userList;
    });


    this.wsService.getMessages().subscribe((data:any) => {
      if (data.type === 'new_message' && this.selectedUser && data.data.sender === this.selectedUser._id) {
        this.messages.push(data.data);
      }
    });
  }

  selectUser(user: any) {
    console.log(user);
    this.selectedUser = user;


    this.messages = [];

    this.wsService.getMessagesForUser(user).subscribe((msgs) => {

      this.messages = msgs;
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.wsService.sendMessage(this.selectedUser, this.newMessage);
    this.messages.push({
      sender: this.currentUserId,
      text: this.newMessage,
    });
    setTimeout(() => {
      this.wsService.getMessagesForUser(this.currentUserId).subscribe((msgs) => {
        this.messages = msgs;
      });
    }, 300);
    this.newMessage = '';
  }

  returnName(user:string){
    const name= this.http.get(`http://localhost:3000/api/users/${user}`).subscribe(
      (res)=>{
        console.log(res);
      }
    );
    console.log(name);
  }

}
