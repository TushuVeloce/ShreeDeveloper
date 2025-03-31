import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceManagementPage } from './attendance-management.page';

describe('AttendanceManagementPage', () => {
  let component: AttendanceManagementPage;
  let fixture: ComponentFixture<AttendanceManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
