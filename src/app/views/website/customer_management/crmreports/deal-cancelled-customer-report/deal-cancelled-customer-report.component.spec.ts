import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DealCancelledCustomerReportComponent } from './deal-cancelled-customer-report.component';

describe('DealCancelledCustomerReportComponent', () => {
  let component: DealCancelledCustomerReportComponent;
  let fixture: ComponentFixture<DealCancelledCustomerReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealCancelledCustomerReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DealCancelledCustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
