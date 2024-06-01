import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyRltPipe } from 'src/app/Pipes/currencyPipe';

@NgModule({
  declarations: [CurrencyRltPipe],
  imports: [CommonModule],
  exports: [CurrencyRltPipe],
})
export class AppPipesModule {}
