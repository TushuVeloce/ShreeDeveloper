import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillPayableReportMobileAppComponent } from './bill-payable-report-mobile-app.component';

describe('BillPayableReportMobileAppComponent', () => {
  let component: BillPayableReportMobileAppComponent;
  let fixture: ComponentFixture<BillPayableReportMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillPayableReportMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillPayableReportMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
