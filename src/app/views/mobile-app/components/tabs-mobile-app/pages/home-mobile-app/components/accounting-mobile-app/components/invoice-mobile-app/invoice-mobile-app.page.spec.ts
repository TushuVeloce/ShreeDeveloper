import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceMobileAppPage } from './invoice-mobile-app.page';

describe('InvoiceMobileAppPage', () => {
  let component: InvoiceMobileAppPage;
  let fixture: ComponentFixture<InvoiceMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
