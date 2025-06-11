import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockManagementMobilePage } from './stock-management-mobile.page';

describe('StockManagementMobilePage', () => {
  let component: StockManagementMobilePage;
  let fixture: ComponentFixture<StockManagementMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockManagementMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
