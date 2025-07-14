import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMobileAppPage } from './home-mobile-app.page';

describe('HomeMobileAppPage', () => {
  let component: HomeMobileAppPage;
  let fixture: ComponentFixture<HomeMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
