import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard, AuthGuard } from './shared/guards';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard]
  },
  {
    path: "auth",
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [LoginGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
