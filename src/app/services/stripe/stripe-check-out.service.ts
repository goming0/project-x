import { Injectable } from '@angular/core';
import { StripeFactoryService, StripeInstance } from 'ngx-stripe';
import { Subscription, switchMap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Product } from 'src/app/types/products';
import { CurrencyStateService } from '../currency-State/currency-state.service';
import { environment } from 'src/environments/environment';

interface IStripeSession {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class StripeCheckOutService {
  public stripe!: StripeInstance;

  public stripePublicKey = environment.stripePublic;

  public stripeAmount = 0;

  private subscriptions: Subscription;

  private currentCurrency = 'USD';

  constructor(
    private http: HttpClient,
    private stripeFactory: StripeFactoryService,
    private currency: CurrencyStateService,
  ) {
    this.subscriptions = new Subscription();
    this.stripe = this.stripeFactory.create(this.stripePublicKey);
  }

  onDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async checkout(data: any) {
    const host = 'http://localhost:3000';
    const prod = data as Product[];
    const checkout: Subscription = this.http
      .post(
        host + '/create-checkout-session',
        {
          data: this.formateProduct(prod),
        },
        { observe: 'response' },
      )
      .pipe(
        switchMap((response: HttpResponse<unknown>) => {
          const session: IStripeSession = response.body as IStripeSession;
          return this.stripe.redirectToCheckout({ sessionId: session.id });
        }),
      )
      .subscribe((result) => {
        // If `redirectToCheckout` fails due to a browser or network
        if (result.error) {
          console.log(result.error);
        }
      });
    this.subscriptions.add(checkout);
  }

  formateProduct(data: Product[]) {
    console.log(data);

    const subCurrency = this.currency.selectedCurrency$.subscribe((code) => (this.currentCurrency = code));
    const res: Record<string, unknown>[] = [];
    data.forEach((el) => {
      const imgs = el.imagesUrls;

      if (imgs.length > 8) {
        imgs.length = 7;
      }

      res.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: el.title,
            description: el.description,
            images: imgs,
          },
          unit_amount: el.price * 100,
        },
        quantity: el.amount,
      });
    });
    subCurrency.unsubscribe();
    return res;
  }
}
