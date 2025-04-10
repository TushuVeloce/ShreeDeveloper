import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-order',
  templateUrl: './stock-order.page.html',
  styleUrls: ['./stock-order.page.scss'],
  standalone:false
})
export class StockOrderPage implements OnInit {

ngOnInit() {
  }
  tasks = [
    { id: '1', title: 'Task 1', description: 'Description 1' },
    { id: '2', title: 'Task 2', description: 'Description 2' }
  ];

  constructor(private router: Router) { }

  addTask() {
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-order/add']); // ✅ Navigate to Add Page
  }

  editTask(taskId: string) {
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-order/edit', taskId]); // ✅ Navigate to Edit Page
  }
}
