import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GovernmentOfficeDetailsComponent } from './government-office-details.component';

describe('GovernmentOfficeDetailsComponent', () => {
  let component: GovernmentOfficeDetailsComponent;
  let fixture: ComponentFixture<GovernmentOfficeDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernmentOfficeDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GovernmentOfficeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
