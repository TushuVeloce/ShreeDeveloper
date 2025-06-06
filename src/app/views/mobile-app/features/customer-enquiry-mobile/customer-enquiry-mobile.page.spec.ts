import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerEnquiryMobilePage } from './customer-enquiry-mobile.page';

describe('CustomerEnquiryMobilePage', () => {
  let component: CustomerEnquiryMobilePage;
  let fixture: ComponentFixture<CustomerEnquiryMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEnquiryMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
