import { Component, HostListener, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserMemoryService } from '../AdminServices/user-memory.service';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CartItemsService } from '../services/cart-items.service';
import { Observable, Subscription } from 'rxjs';
import { CurrencyStateService } from '../services/currency-State/currency-state.service';
import { NgForm } from '@angular/forms';
import { CategoryStateService } from '../services/category-state.service';
import { CheckIpService } from '../services/checkIp/check-ip.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @HostListener('document:click', ['$event.target'])
  collapseNavbar(el: HTMLElement): void {
    const navbar = document.getElementById('navbarNavDropdown');
    const arr = Object.values(el.classList);
    if (arr.some((className) => className === 'currencySelector') || this.showAutoBox) {
      return;
    }
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
      navbar.parentElement?.classList.toggle('collapsed');
    }
  }

  @Output() categorySelected = new EventEmitter<string>();

  private subCurrency?: Subscription;

  amountProductsInCart?: Observable<number>;

  singUpIsInvalid = false;

  currentCurrency = 'USD';

  showAutoBox = false;

  user: {
    name: string;
    password: string | number;
  } = {
    name: '',
    password: '',
  };

  selectedCategory = 'All';

  constructor(
    private router: Router,
    public authService: UserMemoryService,
    private angularFireAuth: Auth,
    private currencyService: CurrencyStateService,
    public cartService: CartItemsService,
    public categoryStateService: CategoryStateService,
    public ipInfoService: CheckIpService,
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('webShopThemeVariant');
    const switcher = <HTMLInputElement | null>document.getElementById('toggle_checkbox');
    if (theme !== null && theme === 'dark') {
      document.body.setAttribute(theme, '');
      if (switcher !== null) {
        switcher.checked = true;
      }
    }
    this.amountProductsInCart = this.cartService.getAmountProductsInCart();
    this.subCurrency = this.currencyService.selectedCurrency$.subscribe((code) => (this.currentCurrency = code));
    this.categoryStateService.selectedCategory$.subscribe((category) => (this.selectedCategory = category));
  }

  setSelectedCategory(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const category = target.value;
      this.router.navigate(['./']);
      this.categoryStateService.setSelectedCategory(category);
    }
  }

  toggleAutoBox() {
    this.showAutoBox = !this.showAutoBox;
  }

  hideAutoBox() {
    this.showAutoBox = false;
    const navbar = document.getElementById('navbarNavDropdown');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
      navbar.parentElement?.classList.toggle('collapsed');
    }
  }

  submit(f: NgForm) {
    this.user.name = f.value.name;
    this.user.password = f.value.password;
    const firebaseUserName = this.authService.firebaseUser.name;
    const firebaseUserPassword = this.authService.firebaseUser.password;
    if (this.user.name === 'admin' && this.user.password === 'admin') {
      this.singUpIsInvalid = false;
      this.authService.login();
      signInWithEmailAndPassword(this.angularFireAuth, firebaseUserName, firebaseUserPassword)
        .then(() => {
          console.log('Авторизация в FireBase успешна');
        })
        .catch((error) => {
          console.log(error);
        });
      if (this.authService.checkAuthentication()) {
        this.router.navigateByUrl('/admin');
        this.hideAutoBox();
        f.reset();

        const navbar = document.getElementById('navbarNavDropdown');
        if (navbar?.classList.contains('show')) {
          navbar.classList.remove('show');
          navbar.parentElement?.classList.toggle('collapsed');
        }
      }
    } else {
      this.singUpIsInvalid = true;
    }
  }

  changeCurrency() {
    this.currencyService.setNewCurrency(this.currentCurrency);
    localStorage.setItem('webShopPrevUsedCurrency', this.currentCurrency);

    const navbar = document.getElementById('navbarNavDropdown');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
      navbar.parentElement?.classList.toggle('collapsed');
    }
  }

  toggleDarkMode() {
    const themedElements = document.body;
    if (themedElements.hasAttribute('dark')) {
      themedElements.removeAttribute('dark');
      localStorage.setItem('webShopThemeVariant', '');
    } else {
      themedElements.setAttribute('dark', '');
      localStorage.setItem('webShopThemeVariant', 'dark');
    }
  }

  ngOnDestroy(): void {
    this.subCurrency?.unsubscribe();
  }
}
