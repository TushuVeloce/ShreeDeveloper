import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalarySlipDetailsMobilePage } from './salary-slip-details-mobile.page';

describe('SalarySlipDetailsMobilePage', () => {
  let component: SalarySlipDetailsMobilePage;
  let fixture: ComponentFixture<SalarySlipDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySlipDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
