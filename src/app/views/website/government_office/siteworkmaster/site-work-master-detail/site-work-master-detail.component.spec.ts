import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SiteWorkMasterDetailComponent } from './site-work-master-detail.component';

describe('SiteWorkMasterDetailComponent', () => {
  let component: SiteWorkMasterDetailComponent;
  let fixture: ComponentFixture<SiteWorkMasterDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteWorkMasterDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteWorkMasterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
