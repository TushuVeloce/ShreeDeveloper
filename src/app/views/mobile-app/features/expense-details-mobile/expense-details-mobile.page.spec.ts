import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseDetailsMobilePage } from './expense-details-mobile.page';

describe('ExpenseDetailsMobilePage', () => {
  let component: ExpenseDetailsMobilePage;
  let fixture: ComponentFixture<ExpenseDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
