import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsMobileAppPage } from './settings-mobile-app.page';

describe('SettingsMobileAppPage', () => {
  let component: SettingsMobileAppPage;
  let fixture: ComponentFixture<SettingsMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
