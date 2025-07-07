import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseMobilePage } from './expense-mobile.page';

describe('ExpenseMobilePage', () => {
  let component: ExpenseMobilePage;
  let fixture: ComponentFixture<ExpenseMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
