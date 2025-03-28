import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttendanceAndSalaryDetailsComponent } from './attendance-and-salary-details.component';

describe('AttendanceAndSalaryDetailsComponent', () => {
  let component: AttendanceAndSalaryDetailsComponent;
  let fixture: ComponentFixture<AttendanceAndSalaryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceAndSalaryDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendanceAndSalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
