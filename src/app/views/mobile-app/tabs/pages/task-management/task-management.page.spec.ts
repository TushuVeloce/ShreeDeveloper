import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskManagementPage } from './task-management.page';

describe('TaskManagementPage', () => {
  let component: TaskManagementPage;
  let fixture: ComponentFixture<TaskManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
