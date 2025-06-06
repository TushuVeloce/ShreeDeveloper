import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteManagementMobilePage } from './site-management-mobile.page';

describe('SiteManagementMobilePage', () => {
  let component: SiteManagementMobilePage;
  let fixture: ComponentFixture<SiteManagementMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteManagementMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
