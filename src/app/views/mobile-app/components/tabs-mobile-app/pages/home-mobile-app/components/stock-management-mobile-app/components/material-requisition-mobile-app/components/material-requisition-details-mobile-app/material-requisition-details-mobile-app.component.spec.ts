import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialRequisitionDetailsMobileAppComponent } from './material-requisition-details-mobile-app.component';

describe('MaterialRequisitionDetailsMobileAppComponent', () => {
  let component: MaterialRequisitionDetailsMobileAppComponent;
  let fixture: ComponentFixture<MaterialRequisitionDetailsMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRequisitionDetailsMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialRequisitionDetailsMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
