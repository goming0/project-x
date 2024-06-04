import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemsService } from 'src/app/services/cart-items.service';
import { StripeCheckOutService } from 'src/app/services/stripe/stripe-check-out.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css'],
})
export class ShippingAddressComponent {
  constructor(private router: Router, private products: CartItemsService, private stripe: StripeCheckOutService) {}

  showNotification = false;

  goToCheckout() {
    this.router.navigate(['']);
  }

  showNotificationFunc() {
    const shippingCost = this.products.getPrice() >= 200 ? 0 : 10;

    this.stripe.checkout(this.products.getProducts(), shippingCost);
    // this.products.clearProducts();
  }
}
