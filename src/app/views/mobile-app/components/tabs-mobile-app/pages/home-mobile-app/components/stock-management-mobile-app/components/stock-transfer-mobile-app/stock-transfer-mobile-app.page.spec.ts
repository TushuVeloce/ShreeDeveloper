import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockTransferMobileAppPage } from './stock-transfer-mobile-app.page';

describe('StockTransferMobileAppPage', () => {
  let component: StockTransferMobileAppPage;
  let fixture: ComponentFixture<StockTransferMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
