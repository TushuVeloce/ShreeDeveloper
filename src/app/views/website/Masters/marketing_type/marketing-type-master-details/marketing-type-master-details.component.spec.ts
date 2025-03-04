import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarketingTypeMasterDetailsComponent } from './marketing-type-master-details.component';

describe('MarketingTypeMasterDetailsComponent', () => {
  let component: MarketingTypeMasterDetailsComponent;
  let fixture: ComponentFixture<MarketingTypeMasterDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingTypeMasterDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingTypeMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
