import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeMobileAppPage } from './income-mobile-app.page';

describe('IncomeMobileAppPage', () => {
  let component: IncomeMobileAppPage;
  let fixture: ComponentFixture<IncomeMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
