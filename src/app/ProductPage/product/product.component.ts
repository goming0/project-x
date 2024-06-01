import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../types/products';
import { FBaseService } from 'src/app/services/fireStore/fbase.service';
import { Review } from 'src/app/types/review';
import { CartItemsService } from 'src/app/services/cart-items.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  private readonly wordsToReplace = ['банан', 'кокос', 'плохой', '@'];

  private readonly wordsPattern = new RegExp(this.wordsToReplace.join('|'), 'gi');

  private docId?: string;

  currentCurrency?: Observable<string>;

  update: any = '';

  prod?: Product | null;

  sizeSelected?: boolean = false;

  buttonMsg = 'ADD TO BAG';

  showNotification = false;

  selectedSize: null | HTMLElement | undefined = null;

  size = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private prodService: FBaseService,
    private products: CartItemsService,
    private sizes: CartItemsService,
  ) {}

  ngOnInit(): void {
    this.currentCurrency = this.prodService.currentCurrency;

    this.routeSubscription = this.route.params.subscribe((params) => {
      this.docId = params['id'];
      this.prodService.getProduct(this.docId!).then((data) => (this.prod = data));
    });
  }

  private validationComments(comment: string) {
    return comment.replace(this.wordsPattern, (match) => '*'.repeat(match.length));
  }

  private recalculateRating(product: Product): number {
    const amountReviews = product.reviews.length;
    if (amountReviews && amountReviews >= 1) {
      let sumOfRatings = 0;
      for (let i = 0; i < amountReviews; i += 1) {
        let rating = product.reviews[i].rating;
        if (isNaN(rating)) {
          rating = 0;
        }
        sumOfRatings += Number(rating);
      }

      return sumOfRatings / amountReviews;
    }
    return 0;
  }

  IsNull(prod: Product | null | undefined) {
    if (this.prod !== null) {
      return true;
    }
    return false;
  }

  addToCart() {
    if (this.sizeSelected === true) {
      this.sizes.setSizes(this.size);
      const count = this.products.amountProducts$.getValue();
      if (localStorage.getItem('cartItems')) {
        if (localStorage.getItem('cartItems')!.length > 2) {
          const savedCartItems = localStorage.getItem('cartItems');
          const savedCartSizes = localStorage.getItem('cartSizes');
          this.update = JSON.parse(savedCartItems as string);
          const size = JSON.parse(savedCartSizes as string);
          this.products.clearProducts();
          this.products.amountProducts$.next(count + 1);
          for (let i = 0; i < this.update.length; i = i + 1) {
            if (this.update[i].amount && this.update[i].amount > 1) {
              this.products.setProducts(this.update[i] as unknown as object);
            } else {
              this.update[i].amount = 1;
              this.products.setProducts(this.update[i] as unknown as object);
            }
          }
          this.sizes.setSizes(size[size.length] as string);
          this.prod!.amount = 1;
          this.products.setProducts(this.prod as object);
          this.products.amountProducts$.next(count + 1);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.prod!.amount = 1;
          this.products.setProducts(this.prod as object);
          this.products.amountProducts$.next(count + 1);
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.prod!.amount = 1;
        this.products.setProducts(this.prod as object);
        this.products.amountProducts$.next(count + 1);
      }
    } else if (this.sizeSelected === false) {
      this.buttonMsg = 'SELECT A SIZE';
    }
  }

  async refreshReviews(review: Review) {
    const reviewId = this.prodService.genFireId();
    review.review_id = reviewId;
    if (this.prod) {
      review.comment = this.validationComments(review.comment);
      //add new review
      this.prod.reviews.push(review);
      //recalculate rating base on review ratings
      this.prod.rating = this.recalculateRating(this.prod);
      //update document on server fireBase
      this.prodService.updateData(this.docId as string, this.prod as Partial<Product>);
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  selectSize(e: Event | EventTarget | null | number): void {
    const element = e as HTMLElement;
    if (element instanceof HTMLElement) {
      if (this.selectedSize) {
        this.selectedSize.classList.remove('selected');
        this.selectedSize = null;
        this.selectedSize = element;
        this.selectedSize.classList.add('selected');
        this.sizeSelected = true;
        this.size = element.textContent as unknown as string;
        this.buttonMsg = 'ADD TO BAG';
      } else {
        this.selectedSize = element;
        this.selectedSize.classList.add('selected');
        this.sizeSelected = true;
        this.buttonMsg = 'ADD TO BAG';
        this.size = element.textContent as unknown as string;
      }
    }
  }

  goToCheckout() {
    this.router.navigate(['/cart']);
  }

  showNotificationFunc() {
    if (this.sizeSelected) {
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 1000);
    }
  }
}
