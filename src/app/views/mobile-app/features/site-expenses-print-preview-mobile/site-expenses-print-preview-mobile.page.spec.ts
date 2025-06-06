import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteExpensesPrintPreviewMobilePage } from './site-expenses-print-preview-mobile.page';

describe('SiteExpensesPrintPreviewMobilePage', () => {
  let component: SiteExpensesPrintPreviewMobilePage;
  let fixture: ComponentFixture<SiteExpensesPrintPreviewMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteExpensesPrintPreviewMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
