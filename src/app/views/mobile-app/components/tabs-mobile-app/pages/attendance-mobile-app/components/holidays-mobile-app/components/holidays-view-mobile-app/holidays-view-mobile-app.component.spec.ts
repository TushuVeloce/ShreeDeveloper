import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HolidaysViewMobileAppComponent } from './holidays-view-mobile-app.component';

describe('HolidaysViewMobileAppComponent', () => {
  let component: HolidaysViewMobileAppComponent;
  let fixture: ComponentFixture<HolidaysViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaysViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaysViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
