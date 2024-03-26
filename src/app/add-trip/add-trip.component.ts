import {Component, OnInit} from '@angular/core'
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms"
import {Validators} from "@angular/forms"
import {Router} from "@angular/router"
import {RouterLink} from "@angular/router"
import {TrolleyManagerService} from "../services/trolley-manager.service";
import {Trip} from "../trip-preview/trip/trip";
import {NgClass} from "@angular/common";
import {TripComponent} from "../trip-preview/trip/trip.component";
import {TripState} from "../trip-preview/trip-state";
import {CurrencyManagerService} from "../services/currency-manager.service";

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    TripComponent,
  ],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent implements OnInit {
  public tripForm = new FormGroup({
    name: new FormControl('', [Validators.required,]),
    location: new FormControl('', [Validators.required,]),
    dates: new FormGroup({
      startDate: new FormControl(new Date(), [Validators.required,]),
      endDate: new FormControl(new Date(), [Validators.required,]),
    }, [ValidatorsSupport.checkDatesRage('startDate', 'endDate')]),
    price: new FormGroup({
      amount: new FormControl(1.0, [Validators.required, Validators.min(1.0),]),
      currency: new FormControl('USD', [Validators.required,]),
    }),
    availableTickets: new FormControl(1, [Validators.required, Validators.min(1),Validators.max(99),]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    imageFile: new FormControl('assets/images/default.jpg', [Validators.required,]),
  })
  public isSubmitted = false
  public previewTrip = new TripState(new Trip(-1, '', '', new Date(), new Date(), 1.0, 1, '', 'assets/images/default.png'))

  constructor(
      private router: Router,
      private trolley: TrolleyManagerService,
  ) { }

  ngOnInit() {
    this.reloadPreview()
  }

    public onSubmit() {
      this.isSubmitted = true

      if(this.tripForm.status === 'INVALID') return

      this.trolley.addTrip(this.previewTrip.trip)
      this.router.navigate(['/trip-preview'], {
        preserveFragment: false,
      })
    }

    public reloadPreview() {
      this.previewTrip = new TripState(new Trip(-1,
          this.tripForm.value.name || '',
          this.tripForm.value.location || '',
          this.tripForm.value.dates?.startDate || new Date(),
          this.tripForm.value.dates?.endDate || new Date(),
          CurrencyManagerService.normalize(this.tripForm.value.price?.amount|| 1.0, this.tripForm.value.price?.currency || 'USD'),
          this.tripForm.value.availableTickets || 1,
          this.tripForm.value.description || '',
          'assets/images/default.png'
      ))
    }
}

class ValidatorsSupport {
  public static checkDatesRage(startDateField: string, endDateField: string): ValidatorFn {
    return (group: AbstractControl) => {
      const startDate = group.get(startDateField)?.value
      const endDate = group.get(endDateField)?.value

      if (startDate > endDate) {
        group.get(endDateField)?.setErrors({ invalidOrder: true })

        return {
          invalidOrder: true
        }
      }

      return null
    }
  }
}
