import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salary-slip-mobile-app',
  templateUrl: './salary-slip-mobile-app.component.html',
  styleUrls: ['./salary-slip-mobile-app.component.scss'],
  standalone: false
})
export class SalarySlipMobileAppComponent implements OnInit {

  ngOnInit() { }
  tasks = [
    { id: '1', title: 'Task 1', description: 'Description 1' },
    { id: '2', title: 'Task 2', description: 'Description 2' }
  ];

  constructor(private router: Router) { }

  addTask() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/add-salary-slip']); // ✅ Navigate to Add Page
  }

  editTask(id: string) {
    this.router.navigate(['/app_homepage/tabs/attendance-management/add-salary-slip']); // ✅ Navigate to Edit Page
  }


}
