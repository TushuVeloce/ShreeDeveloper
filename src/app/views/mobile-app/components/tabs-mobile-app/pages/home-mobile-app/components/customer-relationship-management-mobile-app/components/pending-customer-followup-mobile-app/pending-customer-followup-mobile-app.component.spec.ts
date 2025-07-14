import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PendingCustomerFollowupMobileAppComponent } from './pending-customer-followup-mobile-app.component';

describe('PendingCustomerFollowupMobileAppComponent', () => {
  let component: PendingCustomerFollowupMobileAppComponent;
  let fixture: ComponentFixture<PendingCustomerFollowupMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingCustomerFollowupMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingCustomerFollowupMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
