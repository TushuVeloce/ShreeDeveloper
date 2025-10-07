import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorServiceMasterViewMobileAppComponent } from './vendor-service-master-view-mobile-app.component';

describe('VendorServiceMasterViewMobileAppComponent', () => {
  let component: VendorServiceMasterViewMobileAppComponent;
  let fixture: ComponentFixture<VendorServiceMasterViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorServiceMasterViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorServiceMasterViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
