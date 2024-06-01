import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/app/types/products';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() product?: Product;

  @Input() currency: string | null = null;

  @Input() cardMaxHeight = 350;

  @Output() clickToProduct = new EventEmitter();

  onClick() {
    this.clickToProduct.emit();
  }
}
