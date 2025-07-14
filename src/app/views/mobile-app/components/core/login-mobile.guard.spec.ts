import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginMobileGuard } from './login-mobile.guard';

describe('loginMobileGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginMobileGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
