import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarketingManagementDetailsMobileAppComponent } from './marketing-management-details-mobile-app.component';

describe('MarketingManagementDetailsMobileAppComponent', () => {
  let component: MarketingManagementDetailsMobileAppComponent;
  let fixture: ComponentFixture<MarketingManagementDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingManagementDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingManagementDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
