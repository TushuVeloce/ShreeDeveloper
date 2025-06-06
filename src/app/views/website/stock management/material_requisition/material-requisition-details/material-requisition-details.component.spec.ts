import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialRequisitionDetailsComponent } from './material-requisition-details.component';

describe('MaterialRequisitionDetailsComponent', () => {
  let component: MaterialRequisitionDetailsComponent;
  let fixture: ComponentFixture<MaterialRequisitionDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRequisitionDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialRequisitionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
