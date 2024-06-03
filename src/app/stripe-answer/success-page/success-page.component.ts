import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css'],
})
export class SuccessPageComponent {
  constructor(private router: Router) {}

  goToHomePage(): void {
    this.router.navigate(['/']); // Перенаправлення на головну сторінку після успішної оплати
  }
}
