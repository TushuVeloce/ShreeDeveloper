import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorServiceMasterMobileAppPage } from './vendor-service-master-mobile-app.page';

describe('VendorServiceMasterMobileAppPage', () => {
  let component: VendorServiceMasterMobileAppPage;
  let fixture: ComponentFixture<VendorServiceMasterMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorServiceMasterMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
