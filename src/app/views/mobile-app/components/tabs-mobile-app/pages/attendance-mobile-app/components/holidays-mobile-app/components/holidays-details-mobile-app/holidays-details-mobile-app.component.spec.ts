import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HolidaysDetailsMobileAppComponent } from './holidays-details-mobile-app.component';

describe('HolidaysDetailsMobileAppComponent', () => {
  let component: HolidaysDetailsMobileAppComponent;
  let fixture: ComponentFixture<HolidaysDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaysDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaysDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
