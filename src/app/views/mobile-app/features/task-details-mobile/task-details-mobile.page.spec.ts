import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsMobilePage } from './task-details-mobile.page';

describe('TaskDetailsMobilePage', () => {
  let component: TaskDetailsMobilePage;
  let fixture: ComponentFixture<TaskDetailsMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
