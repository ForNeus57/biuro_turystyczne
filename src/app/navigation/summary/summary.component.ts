import {Component, OnInit} from '@angular/core';
import {TrolleyManagerService} from "../../services/trolley-manager.service";
import {RouterLink} from "@angular/router";
import {CurrencyManagerService} from "../../services/currency-manager.service";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  public itemsSize: number = 0;
  public totalPrice: number = 0;
  public priceExchangeCurrency = CurrencyManagerService.currencies[0]

  constructor(
      private trolleyService: TrolleyManagerService,
      private currencyService: CurrencyManagerService,
  ) {
  }

  ngOnInit() {
    this.currencyService.subscribeToCurrencyChange().subscribe((currency) => {
      this.priceExchangeCurrency = currency
    })
    this.trolleyService.getSize().subscribe((size) => {
      this.itemsSize = size;
    })
    this.trolleyService.getPredictedPrice().subscribe((price) => {
      this.totalPrice = price;
    })
  }

}
