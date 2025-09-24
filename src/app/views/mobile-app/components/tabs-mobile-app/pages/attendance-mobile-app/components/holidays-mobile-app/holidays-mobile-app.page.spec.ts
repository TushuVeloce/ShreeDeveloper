import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolidaysMobileAppPage } from './holidays-mobile-app.page';

describe('HolidaysMobileAppPage', () => {
  let component: HolidaysMobileAppPage;
  let fixture: ComponentFixture<HolidaysMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaysMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
