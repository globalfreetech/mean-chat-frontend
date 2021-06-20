import { Router } from '@angular/router';
import { UserService } from './../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  invalid: boolean;
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createRegistForm();
  }

  // Initialize the form
  createRegistForm() {
    this.signupForm = this.fb.group({
      name: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required]),
      confirmPassword: this.fb.control(null),
    }, { validators: this.checkPasswords })
  }

  // Password validators
  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }

  // Register Form Controls
  get r() {
    return this.signupForm.controls;
  }

  // Submits the registeration form
  onSubmit() {
    if (this.signupForm.invalid) {
      this.invalid = true;
      return;
    }
    this.invalid = false;
    this.submitted = true;

    this._userService.signupUser(this.signupForm.value).subscribe((res: any) => {
      this.signupForm.reset();
      this.router.navigateByUrl('/');
      this.submitted = false;
    }, (err: any) => {
      console.log(err);
      this.submitted = false;
    })

  }

}
