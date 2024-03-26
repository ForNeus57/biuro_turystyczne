import { Component } from '@angular/core';
import {FilterService, FilterState} from "../../services/filter.service";
import {CurrencyManagerService} from "../../../services/currency-manager.service";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-filter',
  standalone: true,
    imports: [
        CurrencyPipe,
        MatSliderModule,
        DatePipe,
        FormsModule
    ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  public bounds = new FilterState()
  public priceExchangeCurrency = CurrencyManagerService.currencies[0]
  public localization: string = ''
  public ratingStart: number = 0
  public ratingEnd: number = 5
  public priceStart: number = 0
  public priceEnd: number = 999_999_999_999
  public dateStart = new Date()
  public dateEnd = new Date()

  constructor(
    private filterService: FilterService,
    private currencyService: CurrencyManagerService,
  ) {
    this.filterService.getFilterBounds().subscribe((bounds) => {
      this.bounds = bounds
      this.ratingStart = bounds.ratingStart
      this.ratingEnd = bounds.ratingEnd
      this.priceStart = bounds.priceStart
      this.priceEnd = bounds.priceEnd
      this.dateStart = bounds.dateStart
      this.dateEnd = bounds.dateEnd
    })
    this.currencyService.subscribeToCurrencyChange().subscribe((currency) => {
      this.priceExchangeCurrency = currency
    })
  }

  convertDate(date: number): string {
    return new Date(date * 1000).toLocaleDateString()
  }

  onChange() {

    console.log(this.localization)
      console.log(this.ratingStart)
      console.log(this.ratingEnd)
      console.log(this.priceStart)
      console.log(this.priceEnd)
      console.log(this.dateStart)
      console.log(this.dateEnd)

    this.filterService.setNewFilter(new FilterState(
      this.localization,
      this.ratingStart,
      this.ratingEnd,
      this.priceStart,
      this.priceEnd,
      this.dateStart,
      this.dateEnd
    ))
  }

  onRatingStartChange(rating: number) {
    this.ratingStart = rating
      this.onChange()
  }

  onRatingEndChange(rating: number) {
    this.ratingEnd = rating
      this.onChange()
  }

  onPriceStartChange(price: number) {
    this.priceStart = price
      this.onChange()
  }

  onPriceEndChange(price: number) {
    this.priceEnd = price
      this.onChange()
  }

  onDateStartChange(date: number) {
    this.dateStart = new Date(date * 1000)
      this.onChange()
  }

  onDateEndChange(date: number) {
    this.dateEnd = new Date(date * 1000)
      this.onChange()
  }

}
