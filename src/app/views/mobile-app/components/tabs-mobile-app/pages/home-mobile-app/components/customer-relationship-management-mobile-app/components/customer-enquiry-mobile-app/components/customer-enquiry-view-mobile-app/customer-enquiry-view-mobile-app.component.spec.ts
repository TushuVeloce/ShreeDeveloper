import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerEnquiryViewMobileAppComponent } from './customer-enquiry-view-mobile-app.component';

describe('CustomerEnquiryViewMobileAppComponent', () => {
  let component: CustomerEnquiryViewMobileAppComponent;
  let fixture: ComponentFixture<CustomerEnquiryViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEnquiryViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerEnquiryViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
