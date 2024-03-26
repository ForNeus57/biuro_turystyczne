import {Component, OnInit} from '@angular/core';
import {TrolleyManagerService} from "../services/trolley-manager.service";
import {ActivatedRoute} from "@angular/router";
import {Trip} from "../trip-preview/trip/trip";
import {BehaviorSubject} from "rxjs";
import {CurrencyManagerService} from "../services/currency-manager.service";
import {FilterComponent} from "../trip-preview/mode-selector/filter/filter.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyPipe, DecimalPipe, NgClass, NgStyle} from "@angular/common";
import {MapComponent} from "../home/map/map.component";
import {Review} from "./review";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    FilterComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    MapComponent,
    NgClass,
    DecimalPipe,
    NgStyle
  ],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class TripDetailsComponent implements OnInit
{
  public readonly warningValue: number = 4
  public id: number = 0
  public tripData = new Trip()
  public priceExchangeCurrency = CurrencyManagerService.currencies[0]
  public reviewForm = new FormGroup({
    name: new FormControl('', [

      Validators.required,
    ]),
    rating: new FormControl(1., [
      Validators.min(1),
      Validators.max(5),
      Validators.required,
    ]),
    description: new FormControl('', [
      Validators.minLength(50),
      Validators.maxLength(500),
      Validators.required,
    ]),
    date: new FormControl(),
  })
  public isSubmitted = false
  public listOfReviews = Array<Review>()
  public reservations: number = 0
  public isBanned = false
  public email = ''

  constructor(
    private trolley: TrolleyManagerService,
    private currency: CurrencyManagerService,
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
  ) {
    this.currency.subscribeToCurrencyChange().subscribe((data) => {
      this.priceExchangeCurrency = data
    })
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
    this.trolley.getData().subscribe((data) => {
      this.tripData = data[this.id].trip
      data[this.id].reservations.subscribe((data) => {
        this.reservations = data
      })
    })
    this.trolley.getReviews().subscribe((data) => {
      this.listOfReviews = data.filter((review) => review.tripId === this.id)
    })

    this.authentication.IsBanned().subscribe((isBanned) => {
      this.isBanned = isBanned
    })

    this.authentication.getUserEmail().subscribe((email) => {
      this.email = email?.email || ''
    })
  }

  ngOnInit() {

  }

  onSubmit() {
    this.isSubmitted = true

    if(this.reviewForm.status === 'INVALID') return

    const formOutput = new Review(
      this.tripData.id,
      this.email,
      this.reviewForm.value.name || '',
      this.reviewForm.value.rating || 1.,
      this.reviewForm.value.description || '',
      this.reviewForm.value.date,
    )
    alert(JSON.stringify(formOutput))
    alert(JSON.stringify(this.id))
    this.trolley.addReview(this.id, formOutput)
    this.reviewForm.reset()

    this.isSubmitted = false
  }

  checkAdd() {
    return this.reservations < this.tripData.availableTickets
  }

  checkRemove() {
    return this.reservations > 0
  }

  addReservation() {
    this.trolley.addToCart(this.tripData.id)
  }

  removeReservation() {
    this.trolley.removeFromCart(this.tripData.id)
  }
}
