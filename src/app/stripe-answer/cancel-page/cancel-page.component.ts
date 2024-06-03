import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-page',
  templateUrl: './cancel-page.component.html',
  styleUrls: ['./cancel-page.component.css'],
})
export class CancelPageComponent {
  constructor(private router: Router) {}

  retryPayment(): void {
    this.router.navigate(['/cart']); // Перенаправлення на сторінку кошика для повторної спроби оплати
  }
}
