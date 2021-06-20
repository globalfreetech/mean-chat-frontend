import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseURL = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  createChatRoom(data) {
    return this.http.post(`${this.baseURL}/chat/create-chatroom`, data)
  }

  getChatRooms() {
    return this.http.get(`${this.baseURL}/chat/get-user-chatRooms`)
  }

  getChatRoom(data) {
    return this.http.post(`${this.baseURL}/chat/get-chatRoom`, data)
  }
  
  sendMessage(data){
    return this.http.post(`${this.baseURL}/chat/create-message`, data)
  }
}
