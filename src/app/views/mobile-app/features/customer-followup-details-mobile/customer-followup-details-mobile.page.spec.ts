import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerFollowupDetailsMobilePage } from './customer-followup-details-mobile.page';

describe('CustomerFollowupDetailsMobilePage', () => {
  let component: CustomerFollowupDetailsMobilePage;
  let fixture: ComponentFixture<CustomerFollowupDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFollowupDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
