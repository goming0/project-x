import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../types/products';

@Injectable({
  providedIn: 'root',
})
export class CartItemsService {
  private products: object[] = [];

  private sizes: string[] = [];

  private totalPrice = 0;

  public amountProducts$ = new BehaviorSubject<number>(0);

  getProducts() {
    if (this.products.length <= 0) {
      this.products = JSON.parse(localStorage.getItem('cartItems') ?? '[]');
    }
    return this.products;
  }

  getPrice() {
    return this.totalPrice;
  }

  setTotalPrice(price: number) {
    this.totalPrice = price;
  }

  setProducts(data: object) {
    this.products.push(data);
    localStorage.setItem('cartItems', JSON.stringify(this.products));
  }

  getAmountProductsInCart() {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      const arrProd = JSON.parse(savedCartItems) as Product[];
      let count = 0;
      for (let i = 0; i < arrProd.length; i += 1) {
        const el = arrProd[i];
        if (el.amount) count += el.amount;
      }
      if (count === 0 || count === arrProd.length) {
        this.amountProducts$.next(arrProd.length);
      } else {
        this.amountProducts$.next(count);
      }
    }
    return this.amountProducts$.asObservable();
  }

  getSizes() {
    return this.sizes;
  }

  setSizes(data: string) {
    if (data !== undefined) {
      this.sizes.push(data);
      localStorage.setItem('cartSizes', JSON.stringify(this.sizes));
    }
  }

  clearProducts() {
    this.products = [];
    localStorage.setItem('cartItems', JSON.stringify('[]'));
    this.amountProducts$.next(0);
  }

  clearSizes() {
    this.sizes = [];
    localStorage.setItem('cartSizes', JSON.stringify(this.sizes));
  }
}
