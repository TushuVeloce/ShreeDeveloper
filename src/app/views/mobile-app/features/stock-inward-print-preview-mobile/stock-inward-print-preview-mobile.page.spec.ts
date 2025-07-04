import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockInwardPrintPreviewMobilePage } from './stock-inward-print-preview-mobile.page';

describe('StockInwardPrintPreviewMobilePage', () => {
  let component: StockInwardPrintPreviewMobilePage;
  let fixture: ComponentFixture<StockInwardPrintPreviewMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInwardPrintPreviewMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
