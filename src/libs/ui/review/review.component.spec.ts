/* eslint-disable @typescript-eslint/dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewComponent } from './review.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { Review } from 'src/app/types/review';
import { By } from '@angular/platform-browser';

const reviewMock = [
  {
    rating: 5,
    review_id: 'wqeqwe',
    comment: 'Test first',
    username: 'User',
  },
  {
    rating: 3,
    review_id: 'wqeqwewww',
    comment: 'first',
    username: 'Roman',
  },
  {
    rating: 1,
    review_id: '231123',
    comment: 'first',
    username: 'Victor',
  },
];

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, StarRatingModule.forRoot()],
      declarations: [ReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewComponent);

    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    component.reviewData = reviewMock;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should textAreaStyle', () => {
    expect(component.textAreaStyle).toBeTruthy();
  });

  it('should reviewData', () => {
    expect(component.reviewData).toBeTruthy();
  });

  it('should emit reviewChange event and reset form when submitting a valid review', () => {
    // Arrange
    const validReview = {
      rating: 5,
      comment: 'Great product',
      username: 'JohnDoe',
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(validReview);
    component.submit();
    // Assert
    expect(emittedReview).toEqual(validReview);
    expect(component.reviewForm.value).toEqual({
      username: null,
      rating: null,
      comment: null,
    });
  });

  it('should reset textarea height to default when form is submit', () => {
    const validReview = {
      rating: 5,
      comment: 'Great product',
      username: 'JohnDoe',
    };
    // Arrange
    component.textAreaStyle.height = '100px';

    // Act
    component.reviewForm.setValue(validReview);
    component.submit();

    // Assert
    expect(component.textAreaStyle.height).toEqual('17px');
  });

  it('should not increase height when no text is entered', () => {
    // Arrange
    const textareaElement = debugEl.query(By.css('textarea')).nativeElement;

    // Act
    component.autoGrow(textareaElement);

    // Assert
    expect(component.textAreaStyle.height).toBe('17px');
  });

  it('should not emit reviewChange event and not reset form when submitting a review with invalid input', () => {
    // Arrange
    const invalidReview = {
      rating: 0,
      comment: '',
      username: '',
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(invalidReview);
    component.submit();

    // Assert
    expect(emittedReview).toBeUndefined();
    expect(component.reviewForm.value).toEqual(invalidReview);
  });

  it('should not emit reviewChange event when submitting an empty review', () => {
    // Arrange
    const emptyReview = {
      rating: null,
      comment: null,
      username: null,
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(emptyReview);
    component.submit();

    // Assert
    expect(emittedReview).toBeUndefined();
    expect(component.reviewForm.value).toEqual(emptyReview);
  });

  it('should mark invalid fields as dirty when submitting a review with invalid input', () => {
    // Arrange
    const isInvalid = component.isInvalid;
    const controls = component.reviewForm.controls;
    const invalidReview = {
      rating: 0,
      comment: '',
      username: '',
    };

    // Act
    component.reviewForm.setValue(invalidReview);
    component.submit();

    // Assert
    expect(isInvalid(controls['username'])).toBe(true);
    expect(isInvalid(controls['comment'])).toBe(true);
    expect(isInvalid(controls['rating'])).toBe(true);
  });

  it('should not emit reviewChange event when submitting a review with a rating of 0', () => {
    // Arrange
    const invalidReview = {
      rating: 0,
      comment: 'Great product!',
      username: 'JohnDoe',
    };
    let emittedReview: Review | undefined;

    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(invalidReview);
    component.submit();

    // Assert
    expect(emittedReview).toBeUndefined();
    expect(component.reviewForm.value).toEqual(invalidReview);
  });

  it('should not emit reviewChange event when submitting a review with a username of 1 character', () => {
    // Arrange
    const invalidReview = {
      rating: 5,
      comment: 'Great product!',
      username: 'J',
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(invalidReview);
    component.submit();

    // Assert
    expect(emittedReview).toBeUndefined();
    expect(component.reviewForm.value).toEqual(invalidReview);
  });

  it('should not emit reviewChange event when submitting a review with a comment containing only whitespace', () => {
    // Arrange
    const whitespaceReview = {
      rating: 5,
      comment: '   ',
      username: 'JohnDoe',
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(whitespaceReview);
    component.submit();

    // Assert
    expect(emittedReview).toBeUndefined();
    expect(component.reviewForm.value).toEqual(whitespaceReview);
  });

  it('should emit reviewChange event when submitting a review with a rating of 5', () => {
    // Arrange
    const validReview = {
      rating: 5,
      comment: 'Great product!',
      username: 'JohnDoe',
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(validReview);
    component.submit();

    // Assert
    expect(emittedReview).toEqual(validReview);
  });

  // Submitting a review with a comment of 6 characters emits a reviewChange event
  it('should emit reviewChange event when submitting a review with a comment of 6 characters', () => {
    // Arrange
    const validReview = {
      rating: 5,
      comment: 'Great!',
      username: 'JohnDoe',
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(validReview);
    component.submit();

    // Assert
    expect(emittedReview).toEqual(validReview);
  });

  // Submitting a review with a comment of 500 characters emits a reviewChange event
  it('should emit reviewChange event when submitting a review with a comment of 500 characters', () => {
    // Arrange
    const validReview = {
      rating: 5,
      comment: 'a'.repeat(500),
      username: 'JohnDoe',
    };
    let emittedReview: Review | undefined;
    component.reviewChange.subscribe((review) => {
      emittedReview = review;
    });

    // Act
    component.reviewForm.setValue(validReview);
    component.submit();

    // Assert
    expect(emittedReview).toEqual(validReview);
  });
});
