import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-material-requisition',
  templateUrl: './add-edit-material-requisition.component.html',
  styleUrls: ['./add-edit-material-requisition.component.scss'],
  standalone:false
})
export class AddEditMaterialRequisitionComponent  implements OnInit {
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
    } else {
    }
    this.router.navigate(['/app_homepage/tabs/task-management']); // ✅ Fix router access
  }
  goBack() {
    this.router.navigate(['/app_homepage/tabs/task-management']);
  }

}
