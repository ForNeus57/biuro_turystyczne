import { TestBed } from '@angular/core/testing';

import { CurrencyManagerService } from './currency-manager.service';

describe('CurrencyManagerService', () => {
  let service: CurrencyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
