import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  ifContains = false;

  ngOnInit() {
    if (localStorage.getItem('cartItems') && localStorage.getItem('cartItems')!.length > 2) {
      this.ifContains = true;
    }
  }
}
