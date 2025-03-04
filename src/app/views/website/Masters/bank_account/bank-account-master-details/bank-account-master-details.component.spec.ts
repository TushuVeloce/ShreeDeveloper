import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BankAccountMasterDetailsComponent } from './bank-account-master-details.component';

describe('BankAccountMasterDetailsComponent', () => {
  let component: BankAccountMasterDetailsComponent;
  let fixture: ComponentFixture<BankAccountMasterDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountMasterDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankAccountMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
