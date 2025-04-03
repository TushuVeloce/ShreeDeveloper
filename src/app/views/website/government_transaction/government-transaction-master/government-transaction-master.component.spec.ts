import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { GovernmentTransactionMasterComponent } from './government-transaction-master.component';


describe('GovernmentOfficeMasterComponent', () => {
  let component: GovernmentTransactionMasterComponent;
  let fixture: ComponentFixture<GovernmentTransactionMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GovernmentTransactionMasterComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GovernmentTransactionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
