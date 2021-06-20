import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { ConversationComponent } from './conversation/conversation.component';
import { AuthGuard } from './../shared/guards';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { TimeagoModule } from 'ngx-timeago';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: environment.baseUrl, options: {} };
@NgModule({
  declarations: [MainComponent, ConversationComponent, ChatRoomsComponent],
  imports: [
    CommonModule,
    FormsModule,
    TimeagoModule.forRoot(),
    SocketIoModule.forRoot(config),
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            redirectTo: '',
            pathMatch: 'full'
          },
          {
            path: ':roomId',
            component: ConversationComponent,
            canActivate: [AuthGuard],
          }
        ]
      }
    ])
  ]
})
export class ChatModule { }
