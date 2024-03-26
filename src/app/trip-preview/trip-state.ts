import {Trip} from "./trip/trip";

export class TripState {

  constructor(
    public trip: Trip,
    public tripClasses: TripClass = TripClass.REGULAR,
  ) {}
}
export enum TripClass {
  CHEAPEST = 'green',
  REGULAR = 'transparent',
  MOST_EXPENSIVE = 'red',
}

export function getClass(currentPrice: number, cheapestPrice: number, mostExpensivePrice: number) {
  const epsilon = 1.0

  if (Math.abs(currentPrice - cheapestPrice) < epsilon) {
    return TripClass.CHEAPEST
  } else if (Math.abs(currentPrice - mostExpensivePrice) < epsilon) {
    return TripClass.MOST_EXPENSIVE
  }
  return TripClass.REGULAR

}
