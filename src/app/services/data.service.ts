import { Injectable } from '@angular/core'
import {HttpClient} from "@angular/common/http"
import {Trip} from "../trip-preview/trip/trip";


@Injectable({
  providedIn: 'root',
})
export class DataService {
  private static readonly tripsDataPath: string = 'http://localhost:3000/data'

  constructor(
    private HttpClient: HttpClient
  ) {}

  getTrips() {
    return this.HttpClient.get<Array<Trip>>(DataService.tripsDataPath)
  }

}
