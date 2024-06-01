import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyStateService {
  private selectedCurrency = new BehaviorSubject<string>('UAH');

  constructor() {
    const currencyCode = localStorage.getItem('webShopPrevUsedCurrency');
    if (currencyCode) {
      this.setNewCurrency(currencyCode);
    }
  }

  get selectedCurrency$() {
    return this.selectedCurrency.asObservable();
  }

  setNewCurrency(currency: string): void {
    this.selectedCurrency.next(currency);
  }
}
