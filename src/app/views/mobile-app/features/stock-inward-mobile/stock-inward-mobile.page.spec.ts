import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockInwardMobilePage } from './stock-inward-mobile.page';

describe('StockInwardMobilePage', () => {
  let component: StockInwardMobilePage;
  let fixture: ComponentFixture<StockInwardMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInwardMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
