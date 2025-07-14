import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerEnquiryMobileAppPage } from './customer-enquiry-mobile-app.page';

describe('CustomerEnquiryMobileAppPage', () => {
  let component: CustomerEnquiryMobileAppPage;
  let fixture: ComponentFixture<CustomerEnquiryMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEnquiryMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
