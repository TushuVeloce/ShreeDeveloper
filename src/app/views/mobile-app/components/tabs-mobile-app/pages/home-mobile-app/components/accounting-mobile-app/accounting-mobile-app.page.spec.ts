import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingMobileAppPage } from './accounting-mobile-app.page';

describe('AccountingMobileAppPage', () => {
  let component: AccountingMobileAppPage;
  let fixture: ComponentFixture<AccountingMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
