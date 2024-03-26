import {Component, Input, OnInit} from '@angular/core'
import {Trip} from "./trip"
import {NgStyle} from "@angular/common"
import {DatePipe, UpperCasePipe, CurrencyPipe, DecimalPipe} from "@angular/common"
import {CurrencyManagerService} from "../../services/currency-manager.service"
import {TripState} from "../trip-state"
import {TrolleyManagerService} from "../../services/trolley-manager.service";
import {RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-trip',
  standalone: true,
  templateUrl: './trip.component.html',
  imports: [
    NgStyle,
    DatePipe,
    UpperCasePipe,
    CurrencyPipe,
    DecimalPipe,
    RouterLink
  ],
  styleUrl: './trip.component.css'
})
export class TripComponent implements OnInit {
  public readonly warningValue: number = 4
  @Input({ alias: 'trip-details', required: true }) tripDetails = new TripState(new Trip())
  public priceExchangeCurrency = CurrencyManagerService.currencies[0]
  public reservations: number = 0
  public isLogged = false
  public isManager = false
  public isAdmin = false

  constructor(
    public currencyService: CurrencyManagerService,
    public trolley: TrolleyManagerService,
    public authentication: AuthenticationService,
  ) {
    this.authentication.CanLoggedIn().subscribe((can) => {
      this.isLogged = can
    })
    this.authentication.CanManagerIn().subscribe((can) => {
      this.isManager = can
    })
    this.authentication.CanAdminIn().subscribe((can) => {
      this.isAdmin = can
    })
  }

  ngOnInit() {
    this.currencyService.subscribeToCurrencyChange().subscribe((currency) => {
      this.priceExchangeCurrency = currency
    })

    try {
      this.trolley.getReservation(this.tripDetails.trip.id)?.subscribe((reservations) => {
        this.reservations = reservations
      })
    } catch (e) {
    }
  }

  checkAdd() {
    return this.reservations < this.tripDetails.trip.availableTickets
  }

  checkRemove() {
    return this.reservations > 0
  }

  addReservation() {
    this.trolley.addToCart(this.tripDetails.trip.id)
  }

  removeReservation() {
    this.trolley.removeFromCart(this.tripDetails.trip.id)
  }


}
