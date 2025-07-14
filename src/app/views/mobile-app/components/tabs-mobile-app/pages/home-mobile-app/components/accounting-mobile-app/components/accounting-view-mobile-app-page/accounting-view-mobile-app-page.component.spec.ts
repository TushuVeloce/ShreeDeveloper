import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountingViewMobileAppPageComponent } from './accounting-view-mobile-app-page.component';

describe('AccountingViewMobileAppPageComponent', () => {
  let component: AccountingViewMobileAppPageComponent;
  let fixture: ComponentFixture<AccountingViewMobileAppPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingViewMobileAppPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountingViewMobileAppPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
