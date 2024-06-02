import { TestBed } from '@angular/core/testing';

import { StripeCheckOutService } from './stripe-check-out.service';

describe('StripeCheckOutService', () => {
  let service: StripeCheckOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeCheckOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
