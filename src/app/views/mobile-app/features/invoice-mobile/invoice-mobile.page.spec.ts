import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceMobilePage } from './invoice-mobile.page';

describe('InvoiceMobilePage', () => {
  let component: InvoiceMobilePage;
  let fixture: ComponentFixture<InvoiceMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
