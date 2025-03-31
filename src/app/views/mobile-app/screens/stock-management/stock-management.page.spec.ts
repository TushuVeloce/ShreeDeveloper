import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockManagementPage } from './stock-management.page';

describe('StockManagementPage', () => {
  let component: StockManagementPage;
  let fixture: ComponentFixture<StockManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
