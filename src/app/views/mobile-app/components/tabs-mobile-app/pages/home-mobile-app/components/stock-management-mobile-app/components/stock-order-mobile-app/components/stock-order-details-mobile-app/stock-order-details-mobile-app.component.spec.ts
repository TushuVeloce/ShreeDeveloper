import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockOrderDetailsMobileAppComponent } from './stock-order-details-mobile-app.component';

describe('StockOrderDetailsMobileAppComponent', () => {
  let component: StockOrderDetailsMobileAppComponent;
  let fixture: ComponentFixture<StockOrderDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOrderDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockOrderDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
