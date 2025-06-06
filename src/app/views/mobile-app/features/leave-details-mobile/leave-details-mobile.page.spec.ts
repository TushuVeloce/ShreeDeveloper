import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveDetailsMobilePage } from './leave-details-mobile.page';

describe('LeaveDetailsMobilePage', () => {
  let component: LeaveDetailsMobilePage;
  let fixture: ComponentFixture<LeaveDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
