import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authMobileGuard } from './auth-mobile.guard';

describe('authMobileGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authMobileGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
