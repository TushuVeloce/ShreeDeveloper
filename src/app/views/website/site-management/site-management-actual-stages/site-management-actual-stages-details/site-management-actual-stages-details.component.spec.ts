import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SiteManagementActualStagesDetailsComponent } from './site-management-actual-stages-details.component';

describe('SiteManagementActualStagesDetailsComponent', () => {
  let component: SiteManagementActualStagesDetailsComponent;
  let fixture: ComponentFixture<SiteManagementActualStagesDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteManagementActualStagesDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteManagementActualStagesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
