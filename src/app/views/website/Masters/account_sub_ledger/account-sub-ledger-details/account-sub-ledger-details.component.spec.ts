import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountSubLedgerDetailsComponent } from './account-sub-ledger-details.component';

describe('AccountSubLedgerDetailsComponent', () => {
  let component: AccountSubLedgerDetailsComponent;
  let fixture: ComponentFixture<AccountSubLedgerDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSubLedgerDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSubLedgerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
