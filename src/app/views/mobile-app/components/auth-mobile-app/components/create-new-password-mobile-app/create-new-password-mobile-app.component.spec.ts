import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateNewPasswordMobileAppComponent } from './create-new-password-mobile-app.component';

describe('CreateNewPasswordMobileAppComponent', () => {
  let component: CreateNewPasswordMobileAppComponent;
  let fixture: ComponentFixture<CreateNewPasswordMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewPasswordMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewPasswordMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
