import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalarySlipMobilePage } from './salary-slip-mobile.page';

describe('SalarySlipMobilePage', () => {
  let component: SalarySlipMobilePage;
  let fixture: ComponentFixture<SalarySlipMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySlipMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
