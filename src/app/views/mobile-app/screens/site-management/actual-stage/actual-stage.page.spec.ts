import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualStagePage } from './actual-stage.page';

describe('ActualStagePage', () => {
  let component: ActualStagePage;
  let fixture: ComponentFixture<ActualStagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualStagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
