import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyRlt' })
export class CurrencyRltPipe implements PipeTransform {
  transform(value: number | undefined, cur: string | null = 'USD', local = 'de-DE'): string | void {
    if (typeof value === 'number') {
      switch (cur) {
        case 'UAH': {
          const newPrice = value * 36.8;
          return new Intl.NumberFormat(local, {
            style: 'currency',
            currency: 'UAH',
            currencyDisplay: 'narrowSymbol',
          }).format(newPrice);
        }
        case 'EUR': {
          const newPrice = value * 0.91;
          return new Intl.NumberFormat(local, {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'narrowSymbol',
          }).format(newPrice);
        }
        default: {
          return new Intl.NumberFormat(local, {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
          }).format(value);
        }
      }
    }
  }
}
