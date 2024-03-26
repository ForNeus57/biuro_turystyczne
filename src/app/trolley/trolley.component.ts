import {Component, OnInit} from '@angular/core';
import {TrolleyManagerService} from "../services/trolley-manager.service";
import {TripState} from "../trip-preview/trip-state";
import {Router, RouterLink} from "@angular/router";
import {TripComponent} from "../trip-preview/trip/trip.component";
import {CurrencyManagerService} from "../services/currency-manager.service";
import {CurrencyPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-trolley',
  standalone: true,
  imports: [
    RouterLink,
    TripComponent,
    CurrencyPipe,
    FormsModule
  ],
  templateUrl: './trolley.component.html',
  styleUrl: './trolley.component.css'
})
export class TrolleyComponent implements OnInit {
  public reservedTrips: Array<TripState> = []
  public selectedTripsInfo: Array<boolean> = []
  public priceCurrencyRate = CurrencyManagerService.currencies[0]
  public priceSum: number = 0
  public userId: number = 0
  public users: Array<string> = []

  constructor(
    private router: Router,
    private trolleyManager: TrolleyManagerService,
    private currencyManager: CurrencyManagerService,
    private authenticationService: AuthenticationService,
  ) {
    this.trolleyManager.getUsers().subscribe((users) => {
      this.users = users.map((value) => value.email)

      this.authenticationService.getUserEmail().subscribe((email) => {
        this.userId = this.users.indexOf(email?.email || '')
      })
    })
  }

  ngOnInit() {
    this.trolleyManager.getPredictedPrice().subscribe((price) => {
      this.priceSum = price
    })
    this.currencyManager.subscribeToCurrencyChange().subscribe((currency) => {
      this.priceCurrencyRate = currency
    })
    this.trolleyManager.getData().subscribe((data) => {
      this.reservedTrips = data.filter((trip) => trip.reservations.getValue() > 0).map((trip) => new TripState(trip.trip))
      this.selectedTripsInfo = data.map(() => false)

      this.reservedTrips.forEach((trip) => {
        this.selectedTripsInfo[trip.trip.id] = true
      })
    })
  }

  public changeBuyingState(index: number) {
    this.selectedTripsInfo[index] = !this.selectedTripsInfo[index]
  }

  public getBuyingState(index: number): boolean {
    return this.selectedTripsInfo[index]
  }

  public buy() {
    this.trolleyManager.buy(this.selectedTripsInfo.map((value, index) => value ? index : -1).filter((value) => value !== -1), this.userId)
    if (!this.selectedTripsInfo.some((value) => value)) {
      this.router.navigate(['/history'], {preserveFragment: false,})
    }
  }

}
