/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from 'src/app/types/review';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  @Input() reviewData?: Review[];

  @Output() reviewChange: EventEmitter<Review> = new EventEmitter();

  reviewForm: FormGroup;

  textAreaStyle = {
    resize: 'none',
    overflow: 'hidden',
    height: '17px',
  };

  constructor(private buildForm: FormBuilder) {
    this.reviewForm = buildForm.group({
      username: ['', [Validators.minLength(2), Validators.required]],
      rating: [0, [Validators.min(1), Validators.required]],
      comment: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  isInvalid(context: AbstractControl<unknown, unknown>) {
    return context && context.invalid && context.dirty;
  }

  autoGrow(element: HTMLTextAreaElement) {
    if (element.value !== '') {
      this.textAreaStyle.height = `${element.scrollHeight}px`;
    }
  }

  submit() {
    if (this.reviewForm.valid) {
      this.reviewChange.emit(this.reviewForm.value);
      this.reviewForm.reset();
      this.textAreaStyle.height = '17px';
      this.reviewForm.controls['rating'].reset();
    } else {
      this.reviewForm.controls['username'].markAsDirty();
      this.reviewForm.controls['comment'].markAsDirty();
      this.reviewForm.controls['rating'].markAsDirty();
    }
  }
}
