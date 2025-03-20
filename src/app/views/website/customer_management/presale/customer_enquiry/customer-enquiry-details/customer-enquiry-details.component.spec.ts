import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerEnquiryDetailsComponent } from './customer-enquiry-details.component';

describe('CustomerEnquiryDetailsComponent', () => {
  let component: CustomerEnquiryDetailsComponent;
  let fixture: ComponentFixture<CustomerEnquiryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEnquiryDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerEnquiryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
