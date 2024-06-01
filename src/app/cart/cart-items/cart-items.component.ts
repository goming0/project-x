import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItemsService } from 'src/app/services/cart-items.service';
import { FBaseService } from 'src/app/services/fireStore/fbase.service';
import { Product } from 'src/app/types/products';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
})
export class CartItemsComponent implements OnInit {
  private prods: string[] | Product[] = [];

  currentCurrency?: Observable<string>;

  size: string[] | undefined;

  shippingPrice = 10;

  subtotalPrice = 0;

  totalPrice = 0;

  dataLoaded = false;

  filteredProds: Product[] = [];

  n = 0;

  constructor(private products: CartItemsService, private fService: FBaseService, private sizes: CartItemsService) {
    this.currentCurrency = this.fService.currentCurrency;
  }

  ngOnInit() {
    const productPromises: any[] = [];
    const savedSizes = localStorage.getItem('cartSizes');
    this.sizes.clearSizes();
    this.size = JSON.parse(savedSizes as string);
    const savedCartItems = localStorage.getItem('cartItems');
    this.filteredProds = JSON.parse(savedCartItems as string);
    this.dataLoaded = true;
    if (localStorage.getItem('cartItems')) {
      Promise.all(productPromises).then(() => {
        for (let i = 0; i < this.size!.length; i++) {
          if (this.filteredProds[i].size === undefined) {
            this.filteredProds[i].size = this.size![i];
          }
        }
        this.filterByAmount(this.filteredProds);
        localStorage.setItem('cartItems', JSON.stringify(this.filteredProds));
      });
    }
    for (let i = 0; i < this.filteredProds!.length; i++) {
      if (this.filteredProds[i].size === undefined) {
        this.filteredProds[i].size = this.size![this.n];
        this.n++;
      }
    }
    this.updateSubtotalPrice(this.filteredProds);
    this.products.clearProducts();
  }

  updateSubtotalPrice(mass: Product[]) {
    this.subtotalPrice = 0;
    for (let i = 0; i < mass.length; i++) {
      this.subtotalPrice = this.subtotalPrice + mass[i].price * mass[i].amount!;
    }
    if (this.subtotalPrice >= 200) {
      this.shippingPrice = 0;
    }
    this.totalPrice = this.subtotalPrice + this.shippingPrice;
  }

  updateShippingPrice() {
    if (this.totalPrice >= 200) {
      this.shippingPrice = 0;
    } else {
      this.shippingPrice = 10;
    }
  }

  deleteProduct(index: number, prod: Product) {
    this.filteredProds.splice(index, 1);
    this.size!.splice(index, 1);
    const count = this.products.amountProducts$.getValue();
    if (this.filteredProds.length === count || this.filteredProds.length === 0) {
      this.products.amountProducts$.next(this.filteredProds.length);
    } else {
      if (prod.amount && prod.amount > 1) {
        this.products.amountProducts$.next(count - prod.amount);
      } else {
        this.products.amountProducts$.next(count - 1);
      }
    }
    this.updateSubtotalPrice(this.filteredProds);
    this.updateShippingPrice();
    this.totalPrice = this.subtotalPrice + this.shippingPrice;
    localStorage.setItem('cartSizes', JSON.stringify(this.size));
    localStorage.setItem('cartItems', JSON.stringify(this.filteredProds));
    localStorage.setItem('subtotalPrice', this.subtotalPrice.toString());
    localStorage.setItem('totalPrice', this.totalPrice.toString());
  }

  filterByAmount(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].id === arr[j].id && arr[i].size === arr[j].size) {
          arr[i].amount += arr[j].amount;
          arr.splice(j, 1);
          j--;
        }
      }
    }
  }

  decreaseAmount(prod: any) {
    if (prod.amount > 1) {
      prod.amount--;

      const count = this.products.amountProducts$.getValue();
      if (this.filteredProds.length < count) {
        this.products.amountProducts$.next(count - 1);
      }
    }
    this.updateSubtotalPrice(this.filteredProds);
    this.updateShippingPrice();
    this.totalPrice = this.subtotalPrice + this.shippingPrice;
    localStorage.setItem('cartItems', JSON.stringify(this.filteredProds));
  }

  increaseAmount(prod: any) {
    prod.amount++;
    const count = this.products.amountProducts$.getValue();
    this.products.amountProducts$.next(count + 1);
    this.updateSubtotalPrice(this.filteredProds);
    this.updateShippingPrice();
    this.totalPrice = this.subtotalPrice + this.shippingPrice;
    localStorage.setItem('cartItems', JSON.stringify(this.filteredProds));
  }
}
