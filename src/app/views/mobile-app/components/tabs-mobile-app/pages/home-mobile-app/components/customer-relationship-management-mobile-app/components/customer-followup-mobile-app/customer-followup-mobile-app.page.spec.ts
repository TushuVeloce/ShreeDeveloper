import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerFollowupMobileAppPage } from './customer-followup-mobile-app.page';

describe('CustomerFollowupMobileAppPage', () => {
  let component: CustomerFollowupMobileAppPage;
  let fixture: ComponentFixture<CustomerFollowupMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFollowupMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
