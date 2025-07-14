import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerEnquiryDetailsMobileAppComponent } from './customer-enquiry-details-mobile-app.component';

describe('CustomerEnquiryDetailsMobileAppComponent', () => {
  let component: CustomerEnquiryDetailsMobileAppComponent;
  let fixture: ComponentFixture<CustomerEnquiryDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEnquiryDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerEnquiryDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
