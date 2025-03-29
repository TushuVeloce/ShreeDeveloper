import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SiteWorkDoneMasterDetailsComponent } from './site-work-done-master-details.component';

describe('SiteWorkDoneMasterDetailsComponent', () => {
  let component: SiteWorkDoneMasterDetailsComponent;
  let fixture: ComponentFixture<SiteWorkDoneMasterDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteWorkDoneMasterDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteWorkDoneMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
