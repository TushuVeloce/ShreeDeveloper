import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlotResellByThirdPartyComponent } from './plot-resell-by-third-party.component';

describe('PlotResellByThirdPartyComponent', () => {
  let component: PlotResellByThirdPartyComponent;
  let fixture: ComponentFixture<PlotResellByThirdPartyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotResellByThirdPartyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlotResellByThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
