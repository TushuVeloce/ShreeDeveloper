import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditCustomerFollowUpComponent } from './add-edit-customer-follow-up.component';

describe('AddEditCustomerFollowUpComponent', () => {
  let component: AddEditCustomerFollowUpComponent;
  let fixture: ComponentFixture<AddEditCustomerFollowUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCustomerFollowUpComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditCustomerFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
