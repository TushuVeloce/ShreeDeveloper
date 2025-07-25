import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerVisitReportMobileAppComponent } from './customer-visit-report-mobile-app.component';

describe('CustomerVisitReportMobileAppComponent', () => {
  let component: CustomerVisitReportMobileAppComponent;
  let fixture: ComponentFixture<CustomerVisitReportMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerVisitReportMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerVisitReportMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
