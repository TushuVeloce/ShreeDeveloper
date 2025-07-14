import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceMobileAppPage } from './attendance-mobile-app.page';

describe('AttendanceMobileAppPage', () => {
  let component: AttendanceMobileAppPage;
  let fixture: ComponentFixture<AttendanceMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
