import { UserService } from './../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  submitted: boolean;
  invalid: boolean;

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createSigninForm();
  }

  // Initialize the form
  createSigninForm() {
    this.signinForm = this.fb.group({
      email: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
    })
  }

  // Sigin Form Controls
  get l() {
    return this.signinForm.controls;
  }

  // Submits the signin form
  onSubmit() {
    if (this.signinForm.invalid) {
      this.invalid = true;
      return;
    }
    this.invalid = false;
    this.submitted = true;

    this._userService.loginUser(this.signinForm.value).subscribe((res: any) => {
      this.signinForm.reset();
      this.router.navigateByUrl('/');
      this.submitted = false;
    }, (err: any) => {
      this.submitted = false;
    })
  }
}
