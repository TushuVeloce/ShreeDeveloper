import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileBottomsheetDropdownComponent } from './mobile-bottomsheet-dropdown.component';

describe('MobileBottomsheetDropdownComponent', () => {
  let component: MobileBottomsheetDropdownComponent;
  let fixture: ComponentFixture<MobileBottomsheetDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileBottomsheetDropdownComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileBottomsheetDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
