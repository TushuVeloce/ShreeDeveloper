import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterMobileAppPage } from './master-mobile-app.page';

describe('MasterMobileAppPage', () => {
  let component: MasterMobileAppPage;
  let fixture: ComponentFixture<MasterMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
