import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalsMobileAppPage } from './approvals-mobile-app.page';

describe('ApprovalsMobileAppPage', () => {
  let component: ApprovalsMobileAppPage;
  let fixture: ComponentFixture<ApprovalsMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
