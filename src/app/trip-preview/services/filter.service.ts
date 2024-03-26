import { Injectable } from '@angular/core';
import {Trip} from "../trip/trip";
import {TrolleyManagerService} from "../../services/trolley-manager.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public localization: string = ''
  public ratingStart: number = 0
  public ratingEnd: number = 5
  public priceStart: number = 0
  public priceEnd: number = 999_999_999_999
  public minStartDate: Date = new Date()
  public maxEndDate: Date = new Date()
  private filterBounds= new BehaviorSubject<FilterState>(new FilterState())
  private selectedFilter = new BehaviorSubject<FilterState>(new FilterState())

  constructor(
      private trolley: TrolleyManagerService
  ) {
    this.trolley.getData().subscribe((data) => {
      this.ratingStart = Math.min(... data.map((trip) => trip.trip.rating))
      this.ratingEnd = Math.max(... data.map((trip) => trip.trip.rating))
      this.priceStart = Math.min(... data.map((trip) => trip.trip.price))
      this.priceEnd = Math.max(... data.map((trip) => trip.trip.price))
      this.minStartDate = new Date(Math.min(... data.map((trip) => trip.trip.startDate.getTime())))
      this.maxEndDate = new Date(Math.max(... data.map((trip) => trip.trip.endDate.getTime())))

      this.filterBounds.next(new FilterState(this.localization, this.ratingStart, this.ratingEnd, this.priceStart, this.priceEnd ,this.minStartDate, this.maxEndDate))
      this.selectedFilter.next(new FilterState(this.localization, this.ratingStart, this.ratingEnd, this.priceStart, this.priceEnd ,this.minStartDate, this.maxEndDate))
    })
  }

  public getSelectedFilter() {
    return this.selectedFilter.asObservable()
  }

  public getFilterBounds() {
    return this.filterBounds.asObservable()
  }

  public setNewFilter(state: FilterState) {
    const calculatedFilter = new FilterState()
    calculatedFilter.localization = state.localization
    calculatedFilter.ratingStart = Math.max(state.ratingStart, this.filterBounds.getValue().ratingStart)
    calculatedFilter.ratingEnd = Math.min(state.ratingEnd, this.filterBounds.getValue().ratingEnd)
    calculatedFilter.priceStart = Math.max(state.priceStart, this.filterBounds.getValue().priceStart)
    calculatedFilter.priceEnd = Math.min(state.priceEnd, this.filterBounds.getValue().priceEnd)
    calculatedFilter.dateStart = new Date(Math.max(state.dateStart.getTime(), this.filterBounds.getValue().dateStart.getTime()))
    calculatedFilter.dateEnd = new Date(Math.min(state.dateEnd.getTime(), this.filterBounds.getValue().dateEnd.getTime()))

    this.selectedFilter.next(calculatedFilter)
  }
}

export class FilterState {
  constructor(
      public localization: string = '',
      public ratingStart: number = 0,
      public ratingEnd: number = 5,
      public priceStart: number = 0,
      public priceEnd: number = 999_999_999_999,
      public dateStart: Date = new Date(),
      public dateEnd: Date = new Date(),
  ) {}

  public matches(trip: Trip): boolean {
    if (this.localization !== '' && !trip.location.toLowerCase().includes(this.localization.toLowerCase())) {
      return false
    }
    if (this.ratingStart > trip.rating || this.ratingEnd < trip.rating) {
      return false
    }
    if (this.priceStart > trip.price || this.priceEnd < trip.price) {
      return false
    }

    return !(this.dateStart > trip.startDate || this.dateEnd < trip.endDate);
  }
}
