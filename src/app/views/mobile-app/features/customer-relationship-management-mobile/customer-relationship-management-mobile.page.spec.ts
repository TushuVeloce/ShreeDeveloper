import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerRelationshipManagementMobilePage } from './customer-relationship-management-mobile.page';

describe('CustomerRelationshipManagementMobilePage', () => {
  let component: CustomerRelationshipManagementMobilePage;
  let fixture: ComponentFixture<CustomerRelationshipManagementMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRelationshipManagementMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
