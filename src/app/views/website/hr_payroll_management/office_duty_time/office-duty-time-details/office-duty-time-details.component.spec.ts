import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfficeDutyTimeDetailsComponent } from './office-duty-time-details.component';

describe('OfficeDutyTimeDetailsComponent', () => {
  let component: OfficeDutyTimeDetailsComponent;
  let fixture: ComponentFixture<OfficeDutyTimeDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeDutyTimeDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfficeDutyTimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
