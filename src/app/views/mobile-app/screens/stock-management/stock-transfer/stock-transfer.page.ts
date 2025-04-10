import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.page.html',
  styleUrls: ['./stock-transfer.page.scss'],
  standalone:false
})
export class StockTransferPage implements OnInit {


ngOnInit() {
  }
  tasks = [
    { id: '1', title: 'Task 1', description: 'Description 1' },
    { id: '2', title: 'Task 2', description: 'Description 2' }
  ];

  constructor(private router: Router) { }

  addTask() {
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-transfer/add']); // ✅ Navigate to Add Page
  }

  editTask(taskId: string) {
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-transfer/edit', taskId]); // ✅ Navigate to Edit Page
  }

}
