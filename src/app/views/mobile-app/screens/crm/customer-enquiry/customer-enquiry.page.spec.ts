import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerEnquiryPage } from './customer-enquiry.page';

describe('VisitedCustomerPage', () => {
  let component: CustomerEnquiryPage;
  let fixture: ComponentFixture<CustomerEnquiryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEnquiryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
