import { TestBed } from '@angular/core/testing';

import { TrolleyManagerService } from './trolley-manager.service';

describe('TrolleyManagerService', () => {
  let service: TrolleyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrolleyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
