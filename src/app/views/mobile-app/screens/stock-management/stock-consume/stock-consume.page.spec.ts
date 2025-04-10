import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockConsumePage } from './stock-consume.page';

describe('StockConsumePage', () => {
  let component: StockConsumePage;
  let fixture: ComponentFixture<StockConsumePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockConsumePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
