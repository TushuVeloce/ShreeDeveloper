import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerPendingFollowUpMobileAppComponent } from './customer-pending-follow-up-mobile-app.component';

describe('CustomerPendingFollowUpMobileAppComponent', () => {
  let component: CustomerPendingFollowUpMobileAppComponent;
  let fixture: ComponentFixture<CustomerPendingFollowUpMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPendingFollowUpMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerPendingFollowUpMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
