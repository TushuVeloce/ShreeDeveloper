import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-stock-transfer',
  templateUrl: './add-edit-stock-transfer.component.html',
  styleUrls: ['./add-edit-stock-transfer.component.scss'],
  standalone:false
})
export class AddEditStockTransferComponent  implements OnInit {

title: string = '';  // ✅ Add missing property
  description: string = ''; // ✅ Add missing property
  isEditMode: boolean = false;
  taskId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    if (this.isEditMode) {
      // Fetch existing data based on `taskId` if needed
      this.title = 'Sample Task'; // Replace with actual data
      this.description = 'Task description'; // Replace with actual data
    }
  }

  save() {
    if (this.isEditMode) {
      console.log('Updating task:', this.taskId);
    } else {
      console.log('Creating new task');
    }
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-transfer']); // ✅ Fix router access
  }
  goBack() {
    this.router.navigate(['/app_homepage/tabs/stock-management/stock-transfer']);
  }


}
