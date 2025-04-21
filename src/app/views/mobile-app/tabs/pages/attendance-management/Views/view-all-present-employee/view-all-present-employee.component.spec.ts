import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewAllPresentEmployeeComponent } from './view-all-present-employee.component';

describe('ViewAllPresentEmployeeComponent', () => {
  let component: ViewAllPresentEmployeeComponent;
  let fixture: ComponentFixture<ViewAllPresentEmployeeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllPresentEmployeeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAllPresentEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
