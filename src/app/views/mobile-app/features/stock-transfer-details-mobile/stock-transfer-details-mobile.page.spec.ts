import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockTransferDetailsMobilePage } from './stock-transfer-details-mobile.page';

describe('StockTransferDetailsMobilePage', () => {
  let component: StockTransferDetailsMobilePage;
  let fixture: ComponentFixture<StockTransferDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
