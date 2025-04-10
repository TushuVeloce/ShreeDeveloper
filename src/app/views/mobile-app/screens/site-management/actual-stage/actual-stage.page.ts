import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actual-stage',
  templateUrl: './actual-stage.page.html',
  styleUrls: ['./actual-stage.page.scss'],
  standalone:false
})
export class ActualStagePage implements OnInit {
 ngOnInit() {
  }
  tasks = [
    { id: '1', title: 'Task 1', description: 'Description 1' },
    { id: '2', title: 'Task 2', description: 'Description 2' }
  ];

  constructor(private router: Router) { }

  addTask() {
    this.router.navigate(['/app_homepage/tabs/site-management/actual-stage/add']); // ✅ Navigate to Add Page
  }

  editTask(taskId: string) {
    this.router.navigate(['/app_homepage/tabs/site-management/actual-stage/edit', taskId]); // ✅ Navigate to Edit Page
  }

}
