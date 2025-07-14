import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalarySlipRequestMobileAppPage } from './salary-slip-request-mobile-app.page';

describe('SalarySlipRequestMobileAppPage', () => {
  let component: SalarySlipRequestMobileAppPage;
  let fixture: ComponentFixture<SalarySlipRequestMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySlipRequestMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
