import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockOrderPage } from './stock-order.page';

describe('StockOrderPage', () => {
  let component: StockOrderPage;
  let fixture: ComponentFixture<StockOrderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
