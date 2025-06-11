import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockOrderMobilePage } from './stock-order-mobile.page';

describe('StockOrderMobilePage', () => {
  let component: StockOrderMobilePage;
  let fixture: ComponentFixture<StockOrderMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOrderMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
