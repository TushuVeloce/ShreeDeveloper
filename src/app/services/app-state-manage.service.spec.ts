import { TestBed } from '@angular/core/testing';

import { AppStateManageService } from './app-state-manage.service';

describe('AppStateManageService', () => {
  let service: AppStateManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
