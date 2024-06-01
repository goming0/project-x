import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { RouterModule } from '@angular/router';
import { ReviewModule } from 'src/libs/ui/review/review.module';
import { StarRatingModule } from 'angular-star-rating';
import { LoadingModule } from 'src/libs/ui/loading/loading.module';
import { AppPipesModule } from '../share/app-pipes/app-pipes.module';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ProductComponent }]),
    AppPipesModule,
    ReviewModule,
    LoadingModule,
    StarRatingModule.forRoot(),
  ],
})
export class ProductModule {}
