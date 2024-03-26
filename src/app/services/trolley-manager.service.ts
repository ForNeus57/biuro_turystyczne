import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Trip} from "../trip-preview/trip/trip";
import {BehaviorSubject} from "rxjs";
import {Review} from "../trip-details/review";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class TrolleyManagerService {
  private trolley = new BehaviorSubject<Array<{trip: Trip; reservations: BehaviorSubject<number>}>>([])
  private size = new BehaviorSubject<number>(0)
  private predictedPrice = new BehaviorSubject<number>(0)
  private history = new BehaviorSubject<Array<{trip: Trip; reservations: number; date: Date, userId: number}>>([])
  private reviews = new BehaviorSubject<Array<Review>>([])
  private users = new BehaviorSubject<Array<{email: string, isAdmin: boolean, isBanned: boolean, isManager: boolean}>>([])

  constructor(
    // private data: DataService,
    private database: AngularFireDatabase,
  ) {
    // data.getTrips().subscribe((data) => {
    //   data.forEach((val, index) => {
    //     database.object(`/trips/${index}`).set({
    //       name: val.name,
    //       location: val.location,
    //       price: val.price,
    //       availableTickets: val.availableTickets,
    //       description: val.description,
    //       imagePath: val.imagePath,
    //       reviews: val.reviews,
    //       rating: val.rating,
    //       startDate: val.startDate,
    //       endDate: val.endDate,
    //     })
    //   })
    // })
    database.object<Trip[]>('/trips').valueChanges().subscribe((trips) => {
      this.resetNotify()
      if (trips === null) {

        return
      }
      this.trolley.next(trips.map(
        (trip) => new Trip(trip.id, trip.name, trip.location, new Date(trip.startDate), new Date(trip.endDate), trip.price, trip.availableTickets, trip.description, trip.imagePath, trip.reviews, trip.rating)
      ).map((trip, index) => {
        trip.id = index
        return {trip: trip, reservations: new BehaviorSubject<number>(0)}
      }))
    })

    database.object<Array<{id: number, reservations: number, date: string, userId: number}>>('/history').valueChanges().subscribe((history) => {
      if (history === null) {
        this.history.next([])
      } else {
        // alert(JSON.stringify(history))
        this.history.next(history.map((value) => {
          return {
            trip: this.trolley.getValue()[value.id].trip,
            reservations: value.reservations,
            date: new Date(value.date.split('.').reverse().join('-')),
            userId: value.userId,
          }

        }))
      }
    })

    database.object<Array<{ date: string, description: string, name: string, nickname: string, rating: number, tripId: number }>>('/reviews').valueChanges().subscribe((reviews) => {
      if (reviews === null) {
        this.reviews.next([])
      } else {
        this.reviews.next(reviews.map((value) => {
          if (value.date == '') {
            return new Review(value.tripId, value.nickname, value.name, value.rating, value.description, null)
          }
          return new Review(value.tripId, value.nickname, value.name, value.rating, value.description, new Date(value.date))
        }))
      }
    })

    database.object<Array<{email: string, isAdmin: boolean, isBanned: boolean, isManager: boolean}>>('/users').valueChanges().subscribe((users) => {
      if (users === null) {
        this.users.next([])
      } else {
        this.users.next(users)
      }
    })
  }

  public clearCart() {
    window.location.reload()
  }

  public addToCart(tripId: number) {
    const trip = this.trolley.getValue().find((trip) => trip.trip.id === tripId)
    if (trip) {
      trip.reservations.next(Math.min(trip.reservations.getValue() + 1, trip.trip.availableTickets))
      this.notify()
    }
  }

  public removeFromCart(tripId: number) {
    const trip = this.trolley.getValue().find((trip) => trip.trip.id === tripId)
    if (trip) {
      trip.reservations.next(Math.max(trip.reservations.getValue() - 1, 0))
      this.notify()
    }
  }

  public getReservation(tripId: number) {
    const trip = this.trolley.getValue().find((trip) => trip.trip.id === tripId)
    if (trip) {
      return trip.reservations.asObservable()
    }
    throw new Error('Trip not found - invalid id provided')
  }

  public removeTrip(tripId: number) {
    this.database.object(`/trips/${tripId}`).remove()
    // this.trolley.next(this.trolley.getValue().filter((trip) => trip.trip.id !== tripId))
    this.notify()
  }

  public addTrip(trip: Trip) {
    trip.id = this.trolley.getValue().reduce((acc, val) => Math.max(acc, val.trip.id), 0) + 1
    // this.trolley.next([... this.trolley.getValue(), {trip: trip, reservations: new BehaviorSubject<number>(0), reviews: new BehaviorSubject<Array<Review>>([]) }])

    this.database.object(`/trips/${trip.id}`).set({
      name: trip.name,
      location: trip.location,
      price: trip.price,
      availableTickets: trip.availableTickets,
      description: trip.description,
      imagePath: trip.imagePath,
      reviews: trip.reviews,
      rating: trip.rating,
      startDate: trip.startDate,
      endDate: trip.endDate,
    })

    this.notify()
  }

  public buy(boughtIndexes: Array<number>, userId: number) {
    const today = new Date()
    // alert(JSON.stringify(boughtIndexes))

    // alert(JSON.stringify(boughtIndexes))
    // alert(JSON.stringify(userId))
    const boughtTrips = this.trolley.getValue().filter((trip) => boughtIndexes.includes(trip.trip.id))

    // this.history.next([... this.history.getValue(), ... boughtTrips.map((trip) => {
    //   return {trip: trip.trip, reservations: trip.reservations.getValue(), date: today}
    // })])
    // alert(JSON.stringify(boughtTrips))

    boughtTrips.forEach((trip, index) => {
      this.database.object(`/history/${this.history.getValue().length + index}`).set({
        id: trip.trip.id,
        reservations: trip.reservations.getValue(),
        date: today.toLocaleDateString(),
        userId: userId,
      })

      this.database.object(`/trips/${trip.trip.id}`).update({
        availableTickets: trip.trip.availableTickets - trip.reservations.getValue(),
      })
    })



    this.trolley.next(this.trolley.getValue().map((trip) => {
      if (boughtIndexes.includes(trip.trip.id)) {
        trip.trip.availableTickets -= trip.reservations.getValue()
        trip.reservations.next(0)
      }
      return trip
    }))
    this.notify()
    // alert(this.history.getValue().map((value) => `trip.id=${value.trip.id},reservations=${value.reservations},date=${value.date}`).join('\n'))
  }

  public getData() {
    return this.trolley.asObservable()
  }

  public getSize() {
    return this.size.asObservable()
  }

  public getPredictedPrice() {
    return this.predictedPrice.asObservable()
  }

  public getHistory() {
      return this.history.asObservable()
  }

  public getReviews() {
    return this.reviews.asObservable()
  }

  public getUsers() {
    return this.users.asObservable()
  }

  public addReview(tripId: number, review: Review) {

    this.database.object(`/reviews/${this.reviews.getValue().length}`).set({
      tripId: tripId.toString(),
      nickname: review.nickname,
      name: review.name,
      rating: review.rating,
      description: review.description,
      date: review.date?.toLocaleDateString() ?? '',
    })
  }

  public addUser(email: string, isAdmin: boolean = false, isBanned: boolean = false, isManager: boolean = false) {
    this.database.object(`/users/${this.users.getValue().length}`).set({
      email: email,
      isAdmin: isAdmin,
      isBanned: isBanned,
      isManager: isManager,
    })
  }

  public changeRole(email: string, role: string, value: boolean) {
    const index = this.users.getValue().findIndex((user) => user.email === email)
    this.database.object(`/users/${index}/${role}`).set(value)
  }

  private notify() {
    const { predictedPrice, reservationsSize } = this.trolley.getValue().reduce((acc, val) => {
      return {
        predictedPrice: acc.predictedPrice + val.reservations.getValue() * val.trip.price,
        reservationsSize: acc.reservationsSize + val.reservations.getValue()
      }
    }, {predictedPrice: 0, reservationsSize: 0})

    this.size.next(reservationsSize)
    this.predictedPrice.next(predictedPrice)
  }

  private resetNotify() {
    this.size.next(0)
    this.predictedPrice.next(0)
  }

}
