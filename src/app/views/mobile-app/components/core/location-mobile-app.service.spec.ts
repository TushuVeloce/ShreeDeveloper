import { TestBed } from '@angular/core/testing';

import { LocationMobileAppService } from './location-mobile-app.service';

describe('LocationMobileAppService', () => {
  let service: LocationMobileAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationMobileAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
