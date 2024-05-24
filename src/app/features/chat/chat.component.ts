import { Component } from '@angular/core';
import { SignalrService } from '../../shared/services/signalr.service';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(private signalRSvc: SignalrService) {}

  currentChat: ChatProperties[] = [];

  chatData: ChatProperties = new ChatProperties();

  ngOnInit(){
    this.signalRSvc.startConnection(); //fammi partire subbbitto la connessione signalR
    this.signalRSvc.AddTransferDataListener((user, msg) => { //carico la funzione che resta lì in ascolto (fa la callback)
      this.chatData = new ChatProperties();
      this.chatData.User = user;
      this.chatData.Message = msg;
      this.currentChat.push(this.chatData);
    });
  }

  ChatSendMessage(htmlObj: HTMLInputElement)
  {
    //l'utente potrebbe essere la mail con cui ho fatto l'accesso, il messaggio lo prendo da input
    this.signalRSvc.sendMessage('Utente Angulatorio', htmlObj.value);
  }


}

class ChatProperties{
  User: string = '';
  Message: string = '';
}
