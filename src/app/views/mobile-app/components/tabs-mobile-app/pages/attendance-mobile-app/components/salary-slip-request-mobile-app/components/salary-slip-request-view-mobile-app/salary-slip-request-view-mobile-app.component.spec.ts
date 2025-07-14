import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalarySlipRequestViewMobileAppComponent } from './salary-slip-request-view-mobile-app.component';

describe('SalarySlipRequestViewMobileAppComponent', () => {
  let component: SalarySlipRequestViewMobileAppComponent;
  let fixture: ComponentFixture<SalarySlipRequestViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipRequestViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalarySlipRequestViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
