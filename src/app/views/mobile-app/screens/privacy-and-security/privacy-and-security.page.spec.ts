import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyAndSecurityPage } from './privacy-and-security.page';

describe('PrivacyAndSecurityPage', () => {
  let component: PrivacyAndSecurityPage;
  let fixture: ComponentFixture<PrivacyAndSecurityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyAndSecurityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
