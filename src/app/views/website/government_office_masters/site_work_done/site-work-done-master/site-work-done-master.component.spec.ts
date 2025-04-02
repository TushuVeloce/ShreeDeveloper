import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SiteWorkDoneMasterComponent } from './site-work-done-master.component';

describe('SiteWorkDoneMasterComponent', () => {
  let component: SiteWorkDoneMasterComponent;
  let fixture: ComponentFixture<SiteWorkDoneMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteWorkDoneMasterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteWorkDoneMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
