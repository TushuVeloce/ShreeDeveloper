import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordMobilePage } from './change-password-mobile.page';

describe('ChangePasswordMobilePage', () => {
  let component: ChangePasswordMobilePage;
  let fixture: ComponentFixture<ChangePasswordMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
