import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteManagementMobileAppPage } from './site-management-mobile-app.page';

describe('SiteManagementMobileAppPage', () => {
  let component: SiteManagementMobileAppPage;
  let fixture: ComponentFixture<SiteManagementMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteManagementMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
