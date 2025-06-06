import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerEnquiryDetailsMobilePage } from './customer-enquiry-details-mobile.page';

describe('CustomerEnquiryDetailsMobilePage', () => {
  let component: CustomerEnquiryDetailsMobilePage;
  let fixture: ComponentFixture<CustomerEnquiryDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEnquiryDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
