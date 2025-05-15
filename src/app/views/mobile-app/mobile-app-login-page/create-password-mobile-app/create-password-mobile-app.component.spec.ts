import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatePasswordMobileAppComponent } from './create-password-mobile-app.component';

describe('CreatePasswordMobileAppComponent', () => {
  let component: CreatePasswordMobileAppComponent;
  let fixture: ComponentFixture<CreatePasswordMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePasswordMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePasswordMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
