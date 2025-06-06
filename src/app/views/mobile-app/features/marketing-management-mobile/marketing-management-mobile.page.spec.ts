import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingManagementMobilePage } from './marketing-management-mobile.page';

describe('MarketingManagementMobilePage', () => {
  let component: MarketingManagementMobilePage;
  let fixture: ComponentFixture<MarketingManagementMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingManagementMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
