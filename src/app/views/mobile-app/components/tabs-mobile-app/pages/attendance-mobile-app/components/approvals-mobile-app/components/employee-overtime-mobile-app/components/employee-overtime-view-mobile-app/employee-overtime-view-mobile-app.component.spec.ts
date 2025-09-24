import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeeOvertimeViewMobileAppComponent } from './employee-overtime-view-mobile-app.component';

describe('EmployeeOvertimeViewMobileAppComponent', () => {
  let component: EmployeeOvertimeViewMobileAppComponent;
  let fixture: ComponentFixture<EmployeeOvertimeViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeOvertimeViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeOvertimeViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
