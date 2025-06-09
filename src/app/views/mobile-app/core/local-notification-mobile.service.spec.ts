import { TestBed } from '@angular/core/testing';

import { LocalNotificationMobileService } from './local-notification-mobile.service';

describe('LocalNotificationMobileService', () => {
  let service: LocalNotificationMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalNotificationMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
