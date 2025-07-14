import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockInwardPrintMobileAppComponent } from './stock-inward-print-mobile-app.component';

describe('StockInwardPrintMobileAppComponent', () => {
  let component: StockInwardPrintMobileAppComponent;
  let fixture: ComponentFixture<StockInwardPrintMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInwardPrintMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockInwardPrintMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
