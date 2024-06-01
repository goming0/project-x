import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemsService } from 'src/app/services/cart-items.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css'],
})
export class ShippingAddressComponent {
  constructor(private router: Router, private products: CartItemsService) {}

  showNotification = false;

  goToCheckout() {
    this.router.navigate(['']);
  }

  showNotificationFunc() {
    this.showNotification = true;
    this.products.clearProducts();
    setTimeout(() => {
      this.products.amountProducts$.next(0);
      this.showNotification = false;
      this.router.navigate(['']);
    }, 2000);
  }
}
