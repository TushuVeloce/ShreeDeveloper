import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeaveRequestMobileAppComponent } from './leave-request-mobile-app.component';

describe('LeaveRequestMobileAppComponent', () => {
  let component: LeaveRequestMobileAppComponent;
  let fixture: ComponentFixture<LeaveRequestMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveRequestMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
