import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageSliderComponent } from './components/imageSlider/imageSlider.component';
import { SwipeDirective } from './swipe.directive';

@NgModule({
  imports: [CommonModule],
  exports: [ImageSliderComponent],
  declarations: [ImageSliderComponent, SwipeDirective],
  providers: [
    {
      provide: 'IsNotMobileDeviceService',
      useValue: navigator.maxTouchPoints <= 0 && !/Android|iPhone|iPad/i.test(navigator.userAgent),
    },
  ],
})
export class ImageSliderModule {}
