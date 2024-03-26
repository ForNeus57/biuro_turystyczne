import {Component, OnInit} from '@angular/core';
import {TrolleyManagerService} from "../services/trolley-manager.service";
import {Trip} from "../trip-preview/trip/trip";
import {CurrencyManagerService} from "../services/currency-manager.service";
import {CurrencyPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  private history: Array<{trip: Trip, reservations: number, date: Date, id: number, status: State, userId: number}> = []
  public shownHistory: Array<{trip: Trip, reservations: number, date: Date, id: number, status: State}> = []
  public priceCurrencyRate = CurrencyManagerService.currencies[0]
  public filterValue = 'all'
  public users: Array<string> = []
  public userId: number = 0

  constructor(
    private trolleyManager: TrolleyManagerService,
    private currencyManager: CurrencyManagerService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.currencyManager.subscribeToCurrencyChange().subscribe((currency) => {
      this.priceCurrencyRate = currency
    })
    this.trolleyManager.getUsers().subscribe((users) => {
      this.users = users.map((value) => value.email)
      this.authenticationService.getUserEmail().subscribe((email) => {
        this.userId = this.users.indexOf(email?.email || '')

        this.trolleyManager.getHistory().subscribe((history) => {
          this.history = history.map((trip, index) => ({trip: trip.trip, reservations: trip.reservations, date: new Date(trip.date), id: index, userId: trip.userId, status: getState(trip.trip.startDate, trip.trip.endDate)}))
          this.history = this.history.filter((trip) => trip.userId === this.userId)
          // alert(JSON.stringify(this.history))
          this.shownHistory = this.history.filter((trip) => this.filterByName(trip.status))
        })
      })
    })
  }

  onFilterChange() {
    this.shownHistory = this.history.filter((trip) => this.filterByName(trip.status))
  }

  public filterByName(state: State) {
    if (this.filterValue === 'all') return true

    if (this.filterValue === 'bought') {
      return state === State.AFTER
    }

    if (this.filterValue === 'active') {
      return state === State.ON_GOING
    }

    return state === State.BEFORE
  }
}

enum State {
  BEFORE = 'Waiting for start',
  ON_GOING = 'Active',
  AFTER = 'Archived',
}

function getState(startDate: Date, endDate: Date): State {
  const today = new Date()

  if (today < startDate) {
    return State.BEFORE
  } else if (today > endDate) {
    return State.AFTER
  }

  return State.ON_GOING
}
