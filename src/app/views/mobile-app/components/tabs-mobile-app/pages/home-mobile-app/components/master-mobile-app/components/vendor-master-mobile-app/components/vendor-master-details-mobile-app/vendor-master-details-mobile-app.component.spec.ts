import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorMasterDetailsMobileAppComponent } from './vendor-master-details-mobile-app.component';

describe('VendorMasterDetailsMobileAppComponent', () => {
  let component: VendorMasterDetailsMobileAppComponent;
  let fixture: ComponentFixture<VendorMasterDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorMasterDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorMasterDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
