import { UserService } from './../../shared/services/user.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit, OnChanges {
  @Input() activeConversation: any;
  isActive: string = null;
  isOpened: boolean = false;
  searchKeyword: string = null;
  usersList: any = null;
  user = JSON.parse(localStorage.getItem('user'))
  chatRooms: any = [];
  onlineUsers: [] = [];

  constructor(
    private router: Router,
    private _userService: UserService,
    private _chatService: ChatService,
    private socket: Socket
  ) {
  }

  ngOnInit(): void {
    this.listChatRooms();
    this.socketFunctions();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['activeConversation'] && changes['activeConversation'].previousValue != changes['activeConversation'].currentValue) {
      this.isActive = changes['activeConversation'].currentValue;
    }
  }

  socketFunctions() {
    this.socket.emit("addUser", this.user?._id)
    this.socket.on("getOnlineUsers", (users) => {
      this.onlineUsers = users;
    })
    this.socket.on("chatRooms", (chatRooms) => {
      this.chatRooms = chatRooms.data;
    })
  }

  checkForOnlineOffline(room) {
    
    if(this.user._id !== room.userOne._id) {
      let user = this.onlineUsers.filter((user:any) => user.userId === room.userOne._id)
      if(user.length) {
        return "assets/images/online.png";
      }else {
        return "assets/images/offline.png";
      }
    }

    if(this.user._id !== room.userTwo._id) {
      let user = this.onlineUsers.filter((user:any) => user.userId === room.userTwo._id)
      if(user.length) {
        return "assets/images/online.png";
      }else {
        return "assets/images/offline.png";
      }
    }
  }
  // LOGOUT
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/signin')
    this.socket.emit("disconnectUser",null)
  }

  // SEARCH USER
  searchUsers() {
    this._userService.searchUsers(this.searchKeyword).subscribe((res: any) => {
      this.usersList = res.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  createChatRoom(user) {
    let data = {
      receiverId: user._id
    }
    this._chatService.createChatRoom(data).subscribe((res: any) => {
      alert(res.message);
      this.isOpened = !this.isOpened;
      this.listChatRooms();
      this.socket.emit("createRoom", user._id)
    }, (err: any) => {
      alert(err.error.message);
    })
  }

  listChatRooms() {
    this._chatService.getChatRooms().subscribe((res: any) => {
      this.chatRooms = res.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  roomClickEvent(room) {
    localStorage.setItem("room", JSON.stringify(room))
  }
}
