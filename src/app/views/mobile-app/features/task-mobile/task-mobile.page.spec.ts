import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskMobilePage } from './task-mobile.page';

describe('TaskMobilePage', () => {
  let component: TaskMobilePage;
  let fixture: ComponentFixture<TaskMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
