import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialRequisitionPage } from './material-requisition.page';

describe('MaterialRequisitionPage', () => {
  let component: MaterialRequisitionPage;
  let fixture: ComponentFixture<MaterialRequisitionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequisitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
