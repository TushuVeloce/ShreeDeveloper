import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllAttendanceMobileAppComponent } from './all-attendance-mobile-app.component';

describe('AllAttendanceMobileAppComponent', () => {
  let component: AllAttendanceMobileAppComponent;
  let fixture: ComponentFixture<AllAttendanceMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAttendanceMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllAttendanceMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
