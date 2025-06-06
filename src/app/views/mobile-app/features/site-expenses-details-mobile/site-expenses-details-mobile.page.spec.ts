import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteExpensesDetailsMobilePage } from './site-expenses-details-mobile.page';

describe('SiteExpensesDetailsMobilePage', () => {
  let component: SiteExpensesDetailsMobilePage;
  let fixture: ComponentFixture<SiteExpensesDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteExpensesDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
