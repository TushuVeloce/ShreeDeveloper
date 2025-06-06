import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyAndSecurityMobilePage } from './privacy-and-security-mobile.page';

describe('PrivacyAndSecurityMobilePage', () => {
  let component: PrivacyAndSecurityMobilePage;
  let fixture: ComponentFixture<PrivacyAndSecurityMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyAndSecurityMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
