import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingCustomerFollowupMobilePage } from './pending-customer-followup-mobile.page';

describe('PendingCustomerFollowupMobilePage', () => {
  let component: PendingCustomerFollowupMobilePage;
  let fixture: ComponentFixture<PendingCustomerFollowupMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingCustomerFollowupMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
