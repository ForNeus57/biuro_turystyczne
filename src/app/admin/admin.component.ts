import { Component } from '@angular/core';
import {TrolleyManagerService} from "../services/trolley-manager.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  public users: Array<{email: string, isAdmin: boolean, isBanned: boolean, isManager: boolean}> = []
  public email = ''
  public role = ''
  public value = ''

  constructor(
    private trolley: TrolleyManagerService,
  ) {
    this.trolley.getUsers().subscribe((users) => {
      this.users = users
    })
  }

  onSubmit() {
    this.trolley.changeRole(this.email, this.role, this.value === 'true')
  }
}
