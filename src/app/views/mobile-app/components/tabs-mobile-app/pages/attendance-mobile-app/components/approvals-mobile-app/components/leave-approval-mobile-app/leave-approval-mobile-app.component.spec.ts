import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeaveApprovalMobileAppComponent } from './leave-approval-mobile-app.component';

describe('LeaveApprovalMobileAppComponent', () => {
  let component: LeaveApprovalMobileAppComponent;
  let fixture: ComponentFixture<LeaveApprovalMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveApprovalMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveApprovalMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
