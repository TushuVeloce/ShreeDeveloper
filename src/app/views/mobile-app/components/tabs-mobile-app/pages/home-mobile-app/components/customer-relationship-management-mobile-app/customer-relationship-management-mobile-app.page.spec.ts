import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerRelationshipManagementMobileAppPage } from './customer-relationship-management-mobile-app.page';

describe('CustomerRelationshipManagementMobileAppPage', () => {
  let component: CustomerRelationshipManagementMobileAppPage;
  let fixture: ComponentFixture<CustomerRelationshipManagementMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRelationshipManagementMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
