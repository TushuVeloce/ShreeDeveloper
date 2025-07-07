import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingReportMobilePage } from './accounting-report-mobile.page';

describe('AccountingReportMobilePage', () => {
  let component: AccountingReportMobilePage;
  let fixture: ComponentFixture<AccountingReportMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReportMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
