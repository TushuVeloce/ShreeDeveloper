import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorQuotationMobilePage } from './vendor-quotation-mobile.page';

describe('VendorQuotationMobilePage', () => {
  let component: VendorQuotationMobilePage;
  let fixture: ComponentFixture<VendorQuotationMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQuotationMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
