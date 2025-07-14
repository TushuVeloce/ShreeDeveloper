import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockManagementMobileAppPage } from './stock-management-mobile-app.page';

describe('StockManagementMobileAppPage', () => {
  let component: StockManagementMobileAppPage;
  let fixture: ComponentFixture<StockManagementMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockManagementMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
