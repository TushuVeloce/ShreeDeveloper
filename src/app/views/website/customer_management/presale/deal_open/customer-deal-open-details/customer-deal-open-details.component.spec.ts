import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerDealOpenDetailsComponent } from './customer-deal-open-details.component';

describe('CustomerDealOpenDetailsComponent', () => {
  let component: CustomerDealOpenDetailsComponent;
  let fixture: ComponentFixture<CustomerDealOpenDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDealOpenDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDealOpenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
