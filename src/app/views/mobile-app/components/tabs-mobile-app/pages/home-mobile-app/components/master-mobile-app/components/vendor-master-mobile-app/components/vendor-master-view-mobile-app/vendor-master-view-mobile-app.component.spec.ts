import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorMasterViewMobileAppComponent } from './vendor-master-view-mobile-app.component';

describe('VendorMasterViewMobileAppComponent', () => {
  let component: VendorMasterViewMobileAppComponent;
  let fixture: ComponentFixture<VendorMasterViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorMasterViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorMasterViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
