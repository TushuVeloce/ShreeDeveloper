import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockInwardMobileAppPage } from './stock-inward-mobile-app.page';

describe('StockInwardMobileAppPage', () => {
  let component: StockInwardMobileAppPage;
  let fixture: ComponentFixture<StockInwardMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInwardMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
