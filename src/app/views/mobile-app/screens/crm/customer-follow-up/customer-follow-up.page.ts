import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-follow-up',
  templateUrl: './customer-follow-up.page.html',
  styleUrls: ['./customer-follow-up.page.scss'],
  standalone:false
})
export class CustomerFollowUpPage implements OnInit {

  ngOnInit() {
  }
  tasks = [
    { id: '1', title: 'Task 1', description: 'Description 1' },
    { id: '2', title: 'Task 2', description: 'Description 2' }
  ];

  constructor(private router: Router) { }

  addTask() {
    this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']); // ✅ Navigate to Add Page
  }

  editTask(taskId: string) {
    this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/edit', taskId]); // ✅ Navigate to Edit Page
  }
}
