import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditCustomerEnquiryComponent } from './add-edit-customer-enquiry.component';

describe('AddEditCustomerEnquiryComponent', () => {
  let component: AddEditCustomerEnquiryComponent;
  let fixture: ComponentFixture<AddEditCustomerEnquiryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditCustomerEnquiryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditCustomerEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
