import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockOrderDetailsMobilePage } from './stock-order-details-mobile.page';

describe('StockOrderDetailsMobilePage', () => {
  let component: StockOrderDetailsMobilePage;
  let fixture: ComponentFixture<StockOrderDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOrderDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
