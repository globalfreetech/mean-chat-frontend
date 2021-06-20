import { LoginGuard } from './../shared/guards';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [SigninComponent, SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'signin',
      },
      {
        path: 'signin',
        component: SigninComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'signup',
        component: SignupComponent,
        canActivate: [LoginGuard]
      }
    ])
  ]
})
export class AuthModule { }
