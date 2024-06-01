import { TestBed } from '@angular/core/testing';

import { CurrencyStateService } from './currency-state.service';

describe('CurrencyStateService', () => {
  let service: CurrencyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
