import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerFollowUpPage } from './customer-follow-up.page';

describe('CustomerFollowUpPage', () => {
  let component: CustomerFollowUpPage;
  let fixture: ComponentFixture<CustomerFollowUpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFollowUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
