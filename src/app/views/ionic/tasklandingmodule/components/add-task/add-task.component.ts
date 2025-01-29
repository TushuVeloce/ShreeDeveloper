import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  standalone:false,
})
export class AddTaskComponent  implements OnInit {

  ngOnInit() {
    console.log('app-task component initialized');
  }
  task = {
    name: '',
    site: '',
    assignedTo: '',
    priority: '',
    startDate: '',
    dueDate: '',
    status: '',
    description: ''
  };

  siteNames = ['Site 1', 'Site 2', 'Site 3'];  // Example dynamic dropdown values
  users = ['User 1', 'User 2', 'User 3'];  // Example dynamic dropdown values
  prioritys=['High','Medium','Low']
  StatusList = ["Not Started", "In Progress", "Completed","Cancelled"]
  constructor(private router: Router) { }

  // Open date picker on clicking input field
  openDatePicker(field: string) {
    const input = document.querySelector(`input[name="${field}"]`) as HTMLInputElement;
    if (input) {
      input.click();  // Now TypeScript knows input is an HTMLInputElement
    }
  }


  // Handle form submission
  onSubmit() {
    console.log('Task submitted:', this.task);
    // Logic to save the task goes here (e.g., call to a service)
  }

  // Navigate back to the task list or homepage
  goBack() {
    this.router.navigate(['/app_homepage']); // Replace with the actual route
  }
}


