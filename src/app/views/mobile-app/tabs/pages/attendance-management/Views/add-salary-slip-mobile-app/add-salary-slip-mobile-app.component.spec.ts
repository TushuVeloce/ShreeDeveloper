import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSalarySlipMobileAppComponent } from './add-salary-slip-mobile-app.component';

describe('AddSalarySlipMobileAppComponent', () => {
  let component: AddSalarySlipMobileAppComponent;
  let fixture: ComponentFixture<AddSalarySlipMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalarySlipMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSalarySlipMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
