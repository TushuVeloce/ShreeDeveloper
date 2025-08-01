import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentHistoryMobileAppComponent } from './payment-history-mobile-app.component';

describe('PaymentHistoryMobileAppComponent', () => {
  let component: PaymentHistoryMobileAppComponent;
  let fixture: ComponentFixture<PaymentHistoryMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHistoryMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentHistoryMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
