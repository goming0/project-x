import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemsService } from 'src/app/services/cart-items.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css'],
})
export class SuccessPageComponent implements OnInit {
  constructor(private router: Router, private products: CartItemsService) {}

  ngOnInit(): void {
    this.products.clearProducts();
  }

  goToHomePage(): void {
    this.router.navigate(['/']); // Перенаправлення на головну сторінку після успішної оплати
  }
}
