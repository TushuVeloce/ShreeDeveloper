import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockManagementViewMobileAppPageComponent } from './stock-management-view-mobile-app-page.component';

describe('StockManagementViewMobileAppPageComponent', () => {
  let component: StockManagementViewMobileAppPageComponent;
  let fixture: ComponentFixture<StockManagementViewMobileAppPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockManagementViewMobileAppPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockManagementViewMobileAppPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
