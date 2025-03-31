import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteManagementPage } from './site-management.page';

describe('SiteManagementPage', () => {
  let component: SiteManagementPage;
  let fixture: ComponentFixture<SiteManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
