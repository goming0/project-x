import { TestBed } from '@angular/core/testing';

import { CheckIpService } from './check-ip.service';

describe('CheckIpService', () => {
  let service: CheckIpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckIpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
