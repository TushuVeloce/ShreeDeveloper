import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingManagementDetailsMobilePage } from './marketing-management-details-mobile.page';

describe('MarketingManagementDetailsMobilePage', () => {
  let component: MarketingManagementDetailsMobilePage;
  let fixture: ComponentFixture<MarketingManagementDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingManagementDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
