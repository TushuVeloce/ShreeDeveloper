import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DynamicFilterBottomsheetComponent } from './dynamic-filter-bottomsheet.component';

describe('DynamicFilterBottomsheetComponent', () => {
  let component: DynamicFilterBottomsheetComponent;
  let fixture: ComponentFixture<DynamicFilterBottomsheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFilterBottomsheetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFilterBottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
