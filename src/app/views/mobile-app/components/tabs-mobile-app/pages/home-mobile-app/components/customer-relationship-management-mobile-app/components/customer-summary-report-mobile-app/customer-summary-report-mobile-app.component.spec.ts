import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerSummaryReportMobileAppComponent } from './customer-summary-report-mobile-app.component';

describe('CustomerSummaryReportMobileAppComponent', () => {
  let component: CustomerSummaryReportMobileAppComponent;
  let fixture: ComponentFixture<CustomerSummaryReportMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSummaryReportMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerSummaryReportMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
