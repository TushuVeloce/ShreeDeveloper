import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrivacyAndSecurityMobileAppComponent } from './privacy-and-security-mobile-app.component';

describe('PrivacyAndSecurityMobileAppComponent', () => {
  let component: PrivacyAndSecurityMobileAppComponent;
  let fixture: ComponentFixture<PrivacyAndSecurityMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyAndSecurityMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyAndSecurityMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
