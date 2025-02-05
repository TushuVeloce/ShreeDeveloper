import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-landing-view',
  templateUrl: './home-landing-view.component.html',
  styleUrls: ['./home-landing-view.component.scss'],
  standalone:false
})
export class HomeLandingViewComponent  implements OnInit {
  userName: string = "John Doe"; 
  Role: string = "Site Manager";
  PunchInTime: string = "12.00 PM 05-02-2025"; 
  tasks: { title: string; description: string; }[] = []; 

  constructor(
    private router: Router,
  ) {
  this.loadTasks();
   }

  ngOnInit(): void {
    console.log('HomeComponent initialized');
  }

loadTasks() {
  // Example API call or data fetching logic
  this.tasks = [
    { title: 'Task 1', description: 'Description 1' },
    { title: 'Task 2', description: 'Description 2' },
    { title: 'Task 3', description: 'Description 3' },
    { title: 'Task 4', description: 'Description 4' },
    { title: 'Task 5', description: 'Description 5' },
    { title: 'Task 6', description: 'Description 6' },
  ];
}

  // Navigate to the Projects page
  goToProjects(): void {
     this.router.navigate(['/app_homepage/task']);
  }

  // Navigate to the Reports page
  goToReports= async()=> {
    await this.router.navigate(['/app_homepage/task']);
  }
  goToCRM = async () => {
    await this.router.navigate(['/app_homepage/task']);
  }
  goToMarketing = async () => {
    await this.router.navigate(['/app_homepage/task']);
  }
  // Navigate to the Task page
   goToTask = async ()=> {
     await this.router.navigate(['/app_homepage/task']);
  }

  // Handle item selection
  onItemSelected(item: { name: string; description: string }): void {
    console.log('Item clicked:', item);
  }

  // Handle action selection for an item
  onActionSelected(event: { action: string; item: any }): void {
    console.log('Action clicked:', event.action, 'for item:', event.item);
  }
}

