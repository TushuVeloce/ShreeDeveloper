import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockConsumeDetailsMobilePage } from './stock-consume-details-mobile.page';

describe('StockConsumeDetailsMobilePage', () => {
  let component: StockConsumeDetailsMobilePage;
  let fixture: ComponentFixture<StockConsumeDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockConsumeDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
