import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalarySlipRequestDetailsComponent } from './salary-slip-request-details.component';

describe('SalarySlipRequestDetailsComponent', () => {
  let component: SalarySlipRequestDetailsComponent;
  let fixture: ComponentFixture<SalarySlipRequestDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipRequestDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalarySlipRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
