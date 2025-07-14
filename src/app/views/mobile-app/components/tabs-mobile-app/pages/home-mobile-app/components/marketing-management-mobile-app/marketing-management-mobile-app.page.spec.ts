import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingManagementMobileAppPage } from './marketing-management-mobile-app.page';

describe('MarketingManagementMobileAppPage', () => {
  let component: MarketingManagementMobileAppPage;
  let fixture: ComponentFixture<MarketingManagementMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingManagementMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
