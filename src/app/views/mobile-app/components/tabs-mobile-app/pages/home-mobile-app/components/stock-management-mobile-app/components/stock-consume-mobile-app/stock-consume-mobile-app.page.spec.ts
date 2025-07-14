import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockConsumeMobileAppPage } from './stock-consume-mobile-app.page';

describe('StockConsumeMobileAppPage', () => {
  let component: StockConsumeMobileAppPage;
  let fixture: ComponentFixture<StockConsumeMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockConsumeMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
