import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorMasterMobileAppPage } from './vendor-master-mobile-app.page';

describe('VendorMasterMobileAppPage', () => {
  let component: VendorMasterMobileAppPage;
  let fixture: ComponentFixture<VendorMasterMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorMasterMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
