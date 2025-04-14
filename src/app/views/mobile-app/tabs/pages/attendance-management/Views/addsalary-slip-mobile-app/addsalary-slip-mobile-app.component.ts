import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addsalary-slip-mobile-app',
  templateUrl: './addsalary-slip-mobile-app.component.html',
  styleUrls: ['./addsalary-slip-mobile-app.component.scss'],
  standalone: false
})
export class AddsalarySlipMobileAppComponent implements OnInit {


  title: string = '';
  description: string = '';
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
    this.router.navigate(['/app_homepage/tabs/attendance-management/salary-slip']); // ✅ Fix router access
  }
  goBack() {
    this.router.navigate(['/app_homepage/tabs/attendance-management/salary-slip']);
  }

}
