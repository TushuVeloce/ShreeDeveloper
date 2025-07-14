import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveRequestMobileAppPage } from './leave-request-mobile-app.page';

describe('LeaveRequestMobileAppPage', () => {
  let component: LeaveRequestMobileAppPage;
  let fixture: ComponentFixture<LeaveRequestMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
