import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddsalarySlipMobileAppComponent } from './addsalary-slip-mobile-app.component';

describe('AddsalarySlipMobileAppComponent', () => {
  let component: AddsalarySlipMobileAppComponent;
  let fixture: ComponentFixture<AddsalarySlipMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsalarySlipMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddsalarySlipMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
