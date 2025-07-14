import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeMobileAppPage } from './office-mobile-app.page';

describe('OfficeMobileAppPage', () => {
  let component: OfficeMobileAppPage;
  let fixture: ComponentFixture<OfficeMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
