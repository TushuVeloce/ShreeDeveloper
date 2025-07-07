import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoicePrintPreviewMobilePage } from './invoice-print-preview-mobile.page';

describe('InvoicePrintPreviewMobilePage', () => {
  let component: InvoicePrintPreviewMobilePage;
  let fixture: ComponentFixture<InvoicePrintPreviewMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePrintPreviewMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
