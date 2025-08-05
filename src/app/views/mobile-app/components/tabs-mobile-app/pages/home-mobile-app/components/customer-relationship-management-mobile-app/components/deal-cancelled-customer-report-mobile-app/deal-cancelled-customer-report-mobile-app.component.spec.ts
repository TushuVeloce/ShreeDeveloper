import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DealCancelledCustomerReportMobileAppComponent } from './deal-cancelled-customer-report-mobile-app.component';

describe('DealCancelledCustomerReportMobileAppComponent', () => {
  let component: DealCancelledCustomerReportMobileAppComponent;
  let fixture: ComponentFixture<DealCancelledCustomerReportMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealCancelledCustomerReportMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DealCancelledCustomerReportMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
