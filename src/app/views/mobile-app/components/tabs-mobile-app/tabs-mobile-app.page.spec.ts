import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsMobileAppPage } from './tabs-mobile-app.page';

describe('TabsMobileAppPage', () => {
  let component: TabsMobileAppPage;
  let fixture: ComponentFixture<TabsMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
