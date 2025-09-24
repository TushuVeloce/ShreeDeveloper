import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalarySlipApprovalMobileAppComponent } from './salary-slip-approval-mobile-app.component';

describe('SalarySlipApprovalMobileAppComponent', () => {
  let component: SalarySlipApprovalMobileAppComponent;
  let fixture: ComponentFixture<SalarySlipApprovalMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipApprovalMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalarySlipApprovalMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
