import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingManagementPage } from './marketing-management.page';

describe('MarketingManagementPage', () => {
  let component: MarketingManagementPage;
  let fixture: ComponentFixture<MarketingManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
