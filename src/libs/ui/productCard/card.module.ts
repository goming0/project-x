import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { AppPipesModule } from 'src/app/share/app-pipes/app-pipes.module';
import { ImageSliderModule } from '../imageSlider/imageSlider.module';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, AppPipesModule, ImageSliderModule],
  exports: [CardComponent],
})
export class ProductCardModule {}
