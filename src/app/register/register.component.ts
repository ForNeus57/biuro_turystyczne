import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {TrolleyManagerService} from "../services/trolley-manager.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public registerForm = new FormGroup({
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
    private trolley: TrolleyManagerService,
  ) {
    // this.authenticationService.signOut()
  }

  public onSubmit() {
    this.isSubmitted = true

    if (this.registerForm.status === 'INVALID') return

    this.can = false

    let result = this.authenticationService.register(this.registerForm.value.email || '', this.registerForm.value.password || '')

    result.then((result) => {
      this.can = true
      if (!result) {
        this.loggedIn = false
        this.isSubmitted = true
      } else {
        this.loggedIn = true
        this.isSubmitted = false
        this.registerForm.reset()
        this.trolley.addUser(result.user?.email || '', false, false, false)
        this.router.navigate(['/'])
      }
    })

    // alert("Login successful!")
  }
}
