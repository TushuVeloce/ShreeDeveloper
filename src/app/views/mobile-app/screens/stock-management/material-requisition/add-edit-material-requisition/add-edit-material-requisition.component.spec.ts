import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditMaterialRequisitionComponent } from './add-edit-material-requisition.component';

describe('AddEditMaterialRequisitionComponent', () => {
  let component: AddEditMaterialRequisitionComponent;
  let fixture: ComponentFixture<AddEditMaterialRequisitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditMaterialRequisitionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditMaterialRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
