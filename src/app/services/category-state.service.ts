import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryStateService {
  private selectedCategorySubject = new BehaviorSubject<string>('All');

  selectedCategory$ = this.selectedCategorySubject.asObservable();

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }

  resetSelectedCategory() {
    this.setSelectedCategory('All');
  }
}
