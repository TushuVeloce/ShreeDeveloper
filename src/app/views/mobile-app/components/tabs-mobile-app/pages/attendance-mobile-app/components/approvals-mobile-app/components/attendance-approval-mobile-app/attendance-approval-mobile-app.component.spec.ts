import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttendanceApprovalMobileAppComponent } from './attendance-approval-mobile-app.component';

describe('AttendanceApprovalMobileAppComponent', () => {
  let component: AttendanceApprovalMobileAppComponent;
  let fixture: ComponentFixture<AttendanceApprovalMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceApprovalMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendanceApprovalMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
