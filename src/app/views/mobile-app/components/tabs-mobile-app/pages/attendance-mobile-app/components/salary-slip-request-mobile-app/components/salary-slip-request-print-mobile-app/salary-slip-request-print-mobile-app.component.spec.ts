import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalarySlipRequestPrintMobileAppComponent } from './salary-slip-request-print-mobile-app.component';

describe('SalarySlipRequestPrintMobileAppComponent', () => {
  let component: SalarySlipRequestPrintMobileAppComponent;
  let fixture: ComponentFixture<SalarySlipRequestPrintMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipRequestPrintMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalarySlipRequestPrintMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
