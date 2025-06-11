import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialRequisitionMobilePage } from './material-requisition-mobile.page';

describe('MaterialRequisitionMobilePage', () => {
  let component: MaterialRequisitionMobilePage;
  let fixture: ComponentFixture<MaterialRequisitionMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequisitionMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
