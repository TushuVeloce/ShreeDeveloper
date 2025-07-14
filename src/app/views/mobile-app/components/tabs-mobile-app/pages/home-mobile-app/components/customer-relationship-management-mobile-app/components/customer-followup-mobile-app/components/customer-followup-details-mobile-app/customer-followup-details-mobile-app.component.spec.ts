import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerFollowupDetailsMobileAppComponent } from './customer-followup-details-mobile-app.component';

describe('CustomerFollowupDetailsMobileAppComponent', () => {
  let component: CustomerFollowupDetailsMobileAppComponent;
  let fixture: ComponentFixture<CustomerFollowupDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFollowupDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFollowupDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
