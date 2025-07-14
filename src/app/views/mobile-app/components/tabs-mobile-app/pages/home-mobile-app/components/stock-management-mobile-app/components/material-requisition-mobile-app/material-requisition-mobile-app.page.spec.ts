import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialRequisitionMobileAppPage } from './material-requisition-mobile-app.page';

describe('MaterialRequisitionMobileAppPage', () => {
  let component: MaterialRequisitionMobileAppPage;
  let fixture: ComponentFixture<MaterialRequisitionMobileAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequisitionMobileAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
