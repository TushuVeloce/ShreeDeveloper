import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteExpensesMobilePage } from './site-expenses-mobile.page';

describe('SiteExpensesMobilePage', () => {
  let component: SiteExpensesMobilePage;
  let fixture: ComponentFixture<SiteExpensesMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteExpensesMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
