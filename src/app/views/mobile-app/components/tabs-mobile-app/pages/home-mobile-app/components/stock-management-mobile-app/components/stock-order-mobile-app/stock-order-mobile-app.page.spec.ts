import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockOrderMobileAppPage } from './stock-order-mobile-app.page';

describe('StockOrderMobileAppPage', () => {
  let component: StockOrderMobileAppPage;
  let fixture: ComponentFixture<StockOrderMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOrderMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
