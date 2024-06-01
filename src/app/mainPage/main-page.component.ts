import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../types/products';
import { FBaseService } from '../services/fireStore/fbase.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CategoryStateService } from '../services/category-state.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  private productsOrigin?: Observable<Product[]>;

  currentCurrency?: Observable<string>;

  prod$?: Observable<Product[]>;

  filteredProducts$?: Observable<Product[]>;

  selectedCategory = 'All';

  constructor(
    private prodService: FBaseService,
    private router: Router,
    private categoryStateService: CategoryStateService,
  ) {}

  ngOnInit(): void {
    this.productsOrigin = this.prod$ = this.prodService.getAllProducts();
    this.currentCurrency = this.prodService.currentCurrency;
    this.filteredProducts$ = this.prod$;
    this.categoryStateService.selectedCategory$.subscribe((category) => {
      this.selectedCategory = category;
      // this.filterProducts();
    });
  }

  onCategorySelected(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  private filterProducts() {
    this.filteredProducts$ = this.productsOrigin?.pipe(
      map((products: Product[]) => {
        const filteredByCategory =
          this.selectedCategory === 'All'
            ? products
            : products.filter((product) => product.typeModel === this.selectedCategory);
        return filteredByCategory;
      }),
    );
  }

  searchValue = '';

  submit(value: string) {
    this.selectedCategory = 'All';
    this.categoryStateService.resetSelectedCategory();
    this.filteredProducts$ = this.filterProductsByTitles(value);
  }

  filterProductsByTitles(productName: string): Observable<Product[]> | undefined {
    const reg = new RegExp(`${productName}`, 'gi');

    return this.productsOrigin?.pipe(
      map((products: Product[]) => products.filter((product) => product.title.match(reg))),
    );
  }

  redirectToProductPage(product: Product) {
    this.router.navigate(['/product', product.docId]);
  }
}
