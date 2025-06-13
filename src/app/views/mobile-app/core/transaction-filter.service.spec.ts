import { TestBed } from '@angular/core/testing';

import { TransactionFilterService } from './transaction-filter.service';

describe('TransactionFilterService', () => {
  let service: TransactionFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
