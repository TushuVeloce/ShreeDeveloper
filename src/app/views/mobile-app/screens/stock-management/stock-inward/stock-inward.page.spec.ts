import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockInwardPage } from './stock-inward.page';

describe('StockInwardPage', () => {
  let component: StockInwardPage;
  let fixture: ComponentFixture<StockInwardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInwardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
