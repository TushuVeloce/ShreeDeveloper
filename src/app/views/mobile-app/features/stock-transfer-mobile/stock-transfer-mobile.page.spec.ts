import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockTransferMobilePage } from './stock-transfer-mobile.page';

describe('StockTransferMobilePage', () => {
  let component: StockTransferMobilePage;
  let fixture: ComponentFixture<StockTransferMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
