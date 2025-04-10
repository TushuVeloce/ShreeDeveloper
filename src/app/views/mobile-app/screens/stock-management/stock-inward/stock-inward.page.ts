import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-inward',
  templateUrl: './stock-inward.page.html',
  styleUrls: ['./stock-inward.page.scss'],
  standalone:false
})
export class StockInwardPage implements OnInit {

ngOnInit() {
  }
  tasks = [
    { id: '1', title: 'Task 1', description: 'Description 1' },
    { id: '2', title: 'Task 2', description: 'Description 2' }
  ];

  constructor(private router: Router) { }

  addTask() {
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-inward/add']); // ✅ Navigate to Add Page
  }

  editTask(taskId: string) {
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-inward/edit', taskId]); // ✅ Navigate to Edit Page
  }


}
