import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  messages: [] = [];
  clickedRoom: any;
  isActive: string = null;
  activeConversation: string;

  constructor(
    private _chatService: ChatService,
    private router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        if(currentUrl !== '/') {
          this.activeConversation = currentUrl.substring(1)
        }
      }
    })
  }

  ngOnInit(): void {
  }

  sendMessage(message) {
    console.log(message, this.clickedRoom);
    let data = {
      chatRoomId: this.clickedRoom._id,
      receiverId: this.clickedRoom.userOne._id == this.user._id ? this.clickedRoom.userTwo._id : this.clickedRoom.userOne._id,
      message: message
    }
    this._chatService.sendMessage(data).subscribe((res: any) => {
      this.messages = res.data
    }, (err: any) => {
      this.messages = [];
      console.log(err);
    })
  }

}
