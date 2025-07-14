import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockConsumeDetailsMobileAppComponent } from './stock-consume-details-mobile-app.component';

describe('StockConsumeDetailsMobileAppComponent', () => {
  let component: StockConsumeDetailsMobileAppComponent;
  let fixture: ComponentFixture<StockConsumeDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockConsumeDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockConsumeDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
