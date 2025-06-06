import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginMobilePage } from './login-mobile.page';

describe('LoginMobilePage', () => {
  let component: LoginMobilePage;
  let fixture: ComponentFixture<LoginMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
