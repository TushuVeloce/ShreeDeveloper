import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceDetailsMobilePage } from './attendance-details-mobile.page';

describe('AttendanceDetailsMobilePage', () => {
  let component: AttendanceDetailsMobilePage;
  let fixture: ComponentFixture<AttendanceDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
