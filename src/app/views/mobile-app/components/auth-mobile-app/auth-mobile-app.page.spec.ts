import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthMobileAppPage } from './auth-mobile-app.page';

describe('AuthMobileAppPage', () => {
  let component: AuthMobileAppPage;
  let fixture: ComponentFixture<AuthMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
