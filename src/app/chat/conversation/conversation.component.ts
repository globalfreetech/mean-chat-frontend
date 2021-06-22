import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('commentEl') comment: ElementRef;
  scrolltop: number = null;
  msg: string = null;
  user = JSON.parse(localStorage.getItem('user'));
  messages: [] = [];
  clickedRoom: object;
  interval: null | ReturnType<typeof setTimeout> = null;

  constructor(
    private _chatService: ChatService,
    private route: ActivatedRoute,
    private socket: Socket
  ) {
    this.route.params.subscribe((params: Params) => {
      if (params.roomId) {
        this.getChatRoomData(params?.roomId);
        this.clickedRoom = JSON.parse(localStorage.getItem('room'));
      }
    })
  }

  ngOnInit() {
    this.socketFunctions();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.comment.nativeElement.scrollTop = this.comment.nativeElement.scrollHeight + 100;
    } catch (err) { }
  }

  socketFunctions() {
    this.socket.on("getMessages", (messages) => {
      console.log(messages);
      if (messages.data.length) {
        if (this.clickedRoom["_id"] == messages.data[0].chatRoomId) {
          this.messages = messages.data;
        }
      }
    })
  }

  getChatRoomData(roomId) {
    let data = {
      chatRoomId: roomId
    }
    this._chatService.getChatRoom(data).subscribe((res: any) => {
      this.messages = res.data
    }, (err: any) => {
      this.messages = [];
      console.log(err);
    })
  }

  sendMessage() {
    this.msg = this.msg.trim();
    if (!this.msg.length) return;
    let data = {
      chatRoomId: this.clickedRoom["_id"],
      receiverId: this.clickedRoom["userOne"]["_id"] == this.user._id ? this.clickedRoom["userTwo"]["_id"] : this.clickedRoom["userOne"]["_id"],
      message: this.msg
    }
    this._chatService.sendMessage(data).subscribe((res: any) => {
      this.msg = null;
      let data = {
        chatRoomId: this.clickedRoom["_id"],
        receiverId: this.clickedRoom["userOne"]["_id"] == this.user._id ? this.clickedRoom["userTwo"]["_id"] : this.clickedRoom["userOne"]["_id"],
      }
      this.getChatRoomData(this.clickedRoom["_id"])
      this.socket.emit("sendMessage", data)
    }, (err: any) => {
      this.messages = [];
      console.log(err);
    })
  }
}
