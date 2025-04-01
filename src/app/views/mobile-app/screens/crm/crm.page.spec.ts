import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CRMPage } from './crm.page';

describe('CRMPage', () => {
  let component: CRMPage;
  let fixture: ComponentFixture<CRMPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
