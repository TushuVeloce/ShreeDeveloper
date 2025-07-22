import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerInfoReportMobileAppComponent } from './customer-info-report-mobile-app.component';

describe('CustomerInfoReportMobileAppComponent', () => {
  let component: CustomerInfoReportMobileAppComponent;
  let fixture: ComponentFixture<CustomerInfoReportMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInfoReportMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerInfoReportMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
