import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockInwardDetailsMobilePage } from './stock-inward-details-mobile.page';

describe('StockInwardDetailsMobilePage', () => {
  let component: StockInwardDetailsMobilePage;
  let fixture: ComponentFixture<StockInwardDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInwardDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
