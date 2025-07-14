import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalarySlipRequestDetailsMobileAppComponent } from './salary-slip-request-details-mobile-app.component';

describe('SalarySlipRequestDetailsMobileAppComponent', () => {
  let component: SalarySlipRequestDetailsMobileAppComponent;
  let fixture: ComponentFixture<SalarySlipRequestDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipRequestDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalarySlipRequestDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
