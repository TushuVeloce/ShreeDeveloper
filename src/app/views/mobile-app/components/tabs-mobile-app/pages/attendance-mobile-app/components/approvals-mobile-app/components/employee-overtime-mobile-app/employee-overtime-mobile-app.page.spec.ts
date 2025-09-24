import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeOvertimeMobileAppPage } from './employee-overtime-mobile-app.page';

describe('EmployeeOvertimeMobileAppPage', () => {
  let component: EmployeeOvertimeMobileAppPage;
  let fixture: ComponentFixture<EmployeeOvertimeMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOvertimeMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
