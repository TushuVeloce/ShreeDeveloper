import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeeOvertimeDetailsComponent } from './employee-overtime-details.component';

describe('EmployeeOvertimeDetailsComponent', () => {
  let component: EmployeeOvertimeDetailsComponent;
  let fixture: ComponentFixture<EmployeeOvertimeDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeOvertimeDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeOvertimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
