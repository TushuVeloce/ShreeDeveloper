import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorServiceMasterDetailsMobileAppComponent } from './vendor-service-master-details-mobile-app.component';

describe('VendorServiceMasterDetailsMobileAppComponent', () => {
  let component: VendorServiceMasterDetailsMobileAppComponent;
  let fixture: ComponentFixture<VendorServiceMasterDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorServiceMasterDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorServiceMasterDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
