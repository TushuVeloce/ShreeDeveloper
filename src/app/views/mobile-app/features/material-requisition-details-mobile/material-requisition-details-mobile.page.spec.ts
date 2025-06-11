import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialRequisitionDetailsMobilePage } from './material-requisition-details-mobile.page';

describe('MaterialRequisitionDetailsMobilePage', () => {
  let component: MaterialRequisitionDetailsMobilePage;
  let fixture: ComponentFixture<MaterialRequisitionDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequisitionDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
