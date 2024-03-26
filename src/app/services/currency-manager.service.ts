import {Injectable} from '@angular/core'
import {BehaviorSubject} from "rxjs";

/**
 * TODO: This service should be used to manage currency conversion via http.
 */
@Injectable({
  providedIn: 'root'
})
export class CurrencyManagerService {
  public static currencies = [
    {name: 'USD', rate: 1.0,},
    {name: 'EUR', rate: 0.91,},
    {name: 'PLN', rate: 3.96,},
  ]

  public currentSymbol = new BehaviorSubject<{name: string, rate: number}>(CurrencyManagerService.currencies[0])

  constructor() {
  }

  public subscribeToCurrencyChange() {
    return this.currentSymbol.asObservable()
  }

  public changeSelectedCurrency(currency: string) {
    this.currentSymbol.next(CurrencyManagerService.currencies.find((c) => c.name === currency) || CurrencyManagerService.currencies[0])
  }

  public static exchange(price: number, currency: string) {
    return price * (CurrencyManagerService.currencies.find((c) => c.name === currency) || CurrencyManagerService.currencies[0]).rate
  }

  public static normalize(price: number, currency: string) {
    return price / (CurrencyManagerService.currencies.find((c) => c.name === currency) || CurrencyManagerService.currencies[0]).rate
  }
}
