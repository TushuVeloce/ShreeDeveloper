import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeeOvertimeDetailsMobileAppComponent } from './employee-overtime-details-mobile-app.component';

describe('EmployeeOvertimeDetailsMobileAppComponent', () => {
  let component: EmployeeOvertimeDetailsMobileAppComponent;
  let fixture: ComponentFixture<EmployeeOvertimeDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeOvertimeDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeOvertimeDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
