import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesMobileAppPage } from './expenses-mobile-app.page';

describe('ExpensesMobileAppPage', () => {
  let component: ExpensesMobileAppPage;
  let fixture: ComponentFixture<ExpensesMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
