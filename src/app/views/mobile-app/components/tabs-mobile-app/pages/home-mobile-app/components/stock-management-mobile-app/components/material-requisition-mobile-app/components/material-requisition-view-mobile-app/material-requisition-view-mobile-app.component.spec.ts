import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialRequisitionViewMobileAppComponent } from './material-requisition-view-mobile-app.component';

describe('MaterialRequisitionViewMobileAppComponent', () => {
  let component: MaterialRequisitionViewMobileAppComponent;
  let fixture: ComponentFixture<MaterialRequisitionViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRequisitionViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialRequisitionViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
