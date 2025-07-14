import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerFollowupViewMobileAppComponent } from './customer-followup-view-mobile-app.component';

describe('CustomerFollowupViewMobileAppComponent', () => {
  let component: CustomerFollowupViewMobileAppComponent;
  let fixture: ComponentFixture<CustomerFollowupViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFollowupViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFollowupViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
