import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarketingManagementViewMobileAppComponent } from './marketing-management-view-mobile-app.component';

describe('MarketingManagementViewMobileAppComponent', () => {
  let component: MarketingManagementViewMobileAppComponent;
  let fixture: ComponentFixture<MarketingManagementViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingManagementViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingManagementViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
