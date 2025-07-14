import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerRelationshipManagementViewMobileAppComponent } from './customer-relationship-management-view-mobile-app.component';

describe('CustomerRelationshipManagementViewMobileAppComponent', () => {
  let component: CustomerRelationshipManagementViewMobileAppComponent;
  let fixture: ComponentFixture<CustomerRelationshipManagementViewMobileAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRelationshipManagementViewMobileAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerRelationshipManagementViewMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
