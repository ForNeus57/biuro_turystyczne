import {Component, OnInit} from '@angular/core'
import {CurrencyManagerService} from "../../services/currency-manager.service"
import {FormsModule} from "@angular/forms";
import {TrolleyManagerService} from "../../services/trolley-manager.service";
import {NgStyle} from "@angular/common";
import {FilterComponent} from "./filter/filter.component";

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle,
    FilterComponent,
  ],
  templateUrl: './mode-selector.component.html',
  styleUrl: './mode-selector.component.css'
})
export class ModeSelectorComponent implements OnInit {
  public static readonly colorThreshold: number = 10

  public selectedCurrency: string = CurrencyManagerService.currencies[0].name
  public trolleySize: number = 0

  constructor(
    public currencyService: CurrencyManagerService,
    public trolley: TrolleyManagerService,
  ) {}

  ngOnInit() {
    this.trolley.getSize().subscribe((size) => this.trolleySize = size)
  }

  change() {
    this.currencyService.changeSelectedCurrency(this.selectedCurrency)
  }

  public determineColor(): string {
    return this.trolleySize < ModeSelectorComponent.colorThreshold ? 'red' : 'green'
  }
}
