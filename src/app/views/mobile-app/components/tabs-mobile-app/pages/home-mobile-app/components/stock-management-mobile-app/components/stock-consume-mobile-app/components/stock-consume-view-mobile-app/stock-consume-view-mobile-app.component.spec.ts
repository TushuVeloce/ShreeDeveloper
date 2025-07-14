import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockConsumeViewMobileAppComponent } from './stock-consume-view-mobile-app.component';

describe('StockConsumeViewMobileAppComponent', () => {
  let component: StockConsumeViewMobileAppComponent;
  let fixture: ComponentFixture<StockConsumeViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockConsumeViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockConsumeViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
