import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeDetailsMobilePage } from './income-details-mobile.page';

describe('IncomeDetailsMobilePage', () => {
  let component: IncomeDetailsMobilePage;
  let fixture: ComponentFixture<IncomeDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
