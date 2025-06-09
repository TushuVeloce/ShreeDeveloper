import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordMobilePage } from './forgot-password-mobile.page';

describe('ForgotPasswordMobilePage', () => {
  let component: ForgotPasswordMobilePage;
  let fixture: ComponentFixture<ForgotPasswordMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
