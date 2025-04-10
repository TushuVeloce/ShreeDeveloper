import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockTransferPage } from './stock-transfer.page';

describe('StockTransferPage', () => {
  let component: StockTransferPage;
  let fixture: ComponentFixture<StockTransferPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
