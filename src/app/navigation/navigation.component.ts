import {Component, NgModule, OnInit} from '@angular/core';
import {SummaryComponent} from "./summary/summary.component";
import {TrolleyManagerService} from "../services/trolley-manager.service";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    SummaryComponent,
    MatToolbarModule, MatButtonModule, MatIconModule, RouterLink
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  public static nearTripDayDifference = 7
  public nearTrip = false
  public userIsLogged = false
  public userIsManager = false
  public userIsAdmin = false
  public username = ''

  constructor(
    private trolley: TrolleyManagerService,
  private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.CanLoggedIn().subscribe((can) => {
      this.userIsLogged = can
      if (can) {
        this.authenticationService.getUserEmail().subscribe((email) => {
          this.username = email?.email || ''
        })
      }
    })
    this.authenticationService.CanManagerIn().subscribe((can) => {
      this.userIsManager = can
    })
    this.authenticationService.CanAdminIn().subscribe((can) => {
      this.userIsAdmin = can
    })
  }

  ngOnInit() {
    this.trolley.getHistory().subscribe((trips) => {
      if (trips.length === 0) return
      this.nearTrip = trips.some((trip) => {
        const days = Math.floor((trip.trip.startDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        return days >= 0 && days <= NavigationComponent.nearTripDayDifference
      })
    })
  }

  signOut() {
    this.authenticationService.signOut()
  }
}
