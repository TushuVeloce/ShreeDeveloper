import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SiteManagementActualStagesComponent } from './site-management-actual-stages.component';

describe('SiteManagementActualStagesComponent', () => {
  let component: SiteManagementActualStagesComponent;
  let fixture: ComponentFixture<SiteManagementActualStagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteManagementActualStagesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteManagementActualStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
