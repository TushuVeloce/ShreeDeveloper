import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorQuotationDetailsMobilePage } from './vendor-quotation-details-mobile.page';

describe('VendorQuotationDetailsMobilePage', () => {
  let component: VendorQuotationDetailsMobilePage;
  let fixture: ComponentFixture<VendorQuotationDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQuotationDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
