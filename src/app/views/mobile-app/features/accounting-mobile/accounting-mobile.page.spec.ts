import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingMobilePage } from './accounting-mobile.page';

describe('AccountingMobilePage', () => {
  let component: AccountingMobilePage;
  let fixture: ComponentFixture<AccountingMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
