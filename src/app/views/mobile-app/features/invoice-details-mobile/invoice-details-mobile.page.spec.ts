import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceDetailsMobilePage } from './invoice-details-mobile.page';

describe('InvoiceDetailsMobilePage', () => {
  let component: InvoiceDetailsMobilePage;
  let fixture: ComponentFixture<InvoiceDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
