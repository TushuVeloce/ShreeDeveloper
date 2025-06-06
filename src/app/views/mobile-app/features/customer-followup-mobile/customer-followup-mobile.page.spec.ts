import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerFollowupMobilePage } from './customer-followup-mobile.page';

describe('CustomerFollowupMobilePage', () => {
  let component: CustomerFollowupMobilePage;
  let fixture: ComponentFixture<CustomerFollowupMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFollowupMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
