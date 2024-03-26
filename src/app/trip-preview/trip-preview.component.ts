import {Component, OnInit} from '@angular/core'
import {TripState, getClass} from "./trip-state"
import {TripComponent} from "./trip/trip.component";
import {ModeSelectorComponent} from "./mode-selector/mode-selector.component";
import {TrolleyManagerService} from "../services/trolley-manager.service";
import {RouterLink} from "@angular/router";
import {FilterService, FilterState} from "./services/filter.service";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-trip-preview',
  standalone: true,
  imports: [TripComponent, ModeSelectorComponent, RouterLink, MatPaginatorModule],
  providers: [FilterService],
  templateUrl: './trip-preview.component.html',
  styleUrl: './trip-preview.component.css'
})
export class TripPreviewComponent implements OnInit {
  public trips: Array<TripState> = []
  public originalData: Array<TripState> = []
  public filter: FilterState | null = null
  public index: number = 0
  public paginationLength: number = 0
  public paginationSize: number = 6

  constructor(
    private trolleyService: TrolleyManagerService,
    private filterService: FilterService,
  ) {
    this.trolleyService.getData().subscribe((data) => {
      this.originalData = Array.from(data, (trip) => new TripState(trip.trip))
      this.changeData()
    })
  }

  ngOnInit() {
    this.filterService.getSelectedFilter().subscribe((filter) => {
      this.filter = filter
      this.changeData()
    })
  }

  public changeData() {
    this.trips = this.originalData.filter((trip) => this.filter?.matches(trip.trip) ?? true)

    this.paginationLength = this.trips.length

    const cheapestPrice = Math.min(... this.trips.map((trip) => trip.trip.price))
    const mostExpensivePrice = Math.max(... this.trips.map((trip) => trip.trip.price))

    this.trips.forEach((trip) => {
      trip.tripClasses = getClass(trip.trip.price, cheapestPrice, mostExpensivePrice)
    })

    this.trips = this.trips.slice(this.index * this.paginationSize, (this.index + 1) * this.paginationSize)
  }

  public handlePageChange(event: PageEvent) {
    this.index = event.pageIndex
    this.paginationSize = event.pageSize
    this.changeData()
  }


}
