import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveMobilePage } from './leave-mobile.page';

describe('LeaveMobilePage', () => {
  let component: LeaveMobilePage;
  let fixture: ComponentFixture<LeaveMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
