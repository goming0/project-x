import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { StarRatingModule } from 'angular-star-rating';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReviewComponent],
  imports: [CommonModule, ReactiveFormsModule, StarRatingModule.forRoot()],
  exports: [ReviewComponent],
})
export class ReviewModule {}
