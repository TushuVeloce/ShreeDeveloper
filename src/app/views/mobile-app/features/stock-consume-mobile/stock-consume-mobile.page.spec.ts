import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockConsumeMobilePage } from './stock-consume-mobile.page';

describe('StockConsumeMobilePage', () => {
  let component: StockConsumeMobilePage;
  let fixture: ComponentFixture<StockConsumeMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockConsumeMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
