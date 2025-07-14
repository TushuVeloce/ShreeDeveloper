import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockOrderPrintMobileAppComponent } from './stock-order-print-mobile-app.component';

describe('StockOrderPrintMobileAppComponent', () => {
  let component: StockOrderPrintMobileAppComponent;
  let fixture: ComponentFixture<StockOrderPrintMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOrderPrintMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockOrderPrintMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
