import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockOrderPrintPreviewMobilePage } from './stock-order-print-preview-mobile.page';

describe('StockOrderPrintPreviewMobilePage', () => {
  let component: StockOrderPrintPreviewMobilePage;
  let fixture: ComponentFixture<StockOrderPrintPreviewMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOrderPrintPreviewMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
