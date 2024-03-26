import { Component } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ])
  })
  public isSubmitted = false;
  public loggedIn = false;
  public can = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    // this.authenticationService.signOut()
  }

  public onSubmit() {
    this.isSubmitted = true

    if (this.loginForm.status === 'INVALID') return

    this.can = false

    let result = this.authenticationService.signIn(this.loginForm.value.email || '', this.loginForm.value.password || '')

    result.then((result) => {
      this.can = true
      if (!result) {
        this.loggedIn = false
        this.isSubmitted = true
        // alert("Login failed!")
      } else {
        this.loggedIn = true
        // alert("Login successful!")
        this.loginForm.reset()
        this.isSubmitted = false
        this.router.navigate(['/'])
      }
    })

    // alert("Login successful!")
  }
}
