import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddLeaveRequestMobileAppComponent } from './add-leave-request-mobile-app.component';

describe('AddLeaveRequestMobileAppComponent', () => {
  let component: AddLeaveRequestMobileAppComponent;
  let fixture: ComponentFixture<AddLeaveRequestMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLeaveRequestMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddLeaveRequestMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
