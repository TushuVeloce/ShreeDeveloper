import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeMobilePage } from './income-mobile.page';

describe('IncomeMobilePage', () => {
  let component: IncomeMobilePage;
  let fixture: ComponentFixture<IncomeMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
