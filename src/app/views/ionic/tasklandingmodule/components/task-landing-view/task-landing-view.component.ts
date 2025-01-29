import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { FilterComponentComponent } from '../filter-component/filter-component.component';
@Component({
  selector: 'app-task-landing-view',
  templateUrl: './task-landing-view.component.html',
  styleUrls: ['./task-landing-view.component.scss'],
  standalone: false,
})
export class TaskLandingViewComponent implements OnInit {
  filterOptions = [
    {
      label: 'Category',
      name: 'category',
      items: ['Technology', 'Health', 'Science'],
    },
    {
      label: 'Price Range',
      name: 'price',
      items: ['Under $50', '$50 - $100', 'Above $100'],
    },
  ];

  tasks = [
    {
      tasktitle: 'Week 1 College Tasks',
      startDate: 'Friday, 5 November 2021',
      dueDate: 'Friday, 1 November 2022',
      progress: 25,
      status: 101, // Completed
      assignTo: 'Pranav Patil',
      siteName: 'New site Kolhapur',
      Description: 'New site opening',
      priority: 101, // High
    },
    {
      tasktitle: 'Week 2 College Tasks',
      startDate: 'Monday, 8 November 2021',
      dueDate: 'Monday, 15 November 2022',
      progress: 50,
      status: 102, // In Progress
      assignTo: 'Ravi Kumar',
      siteName: 'Old site Pune',
      Description: 'Site renovation',
      priority: 102, // Medium
    },
    {
      tasktitle: 'Week 3 College Tasks',
      startDate: 'Wednesday, 10 November 2021',
      dueDate: 'Wednesday, 20 November 2022',
      progress: 0,
      status: 103, // Not Started
      assignTo: 'Sneha Joshi',
      siteName: 'Site Nashik',
      Description: 'Site inspection',
      priority: 103, // Low
    },
    {
      tasktitle: 'Week 4 College Tasks',
      startDate: 'Wednesday, 10 November 2021',
      dueDate: 'Wednesday, 20 November 2022',
      progress: 0,
      status: 104, // Cancelled
      assignTo: 'Sneha Joshi',
      siteName: 'Site Nashik',
      Description: 'Site inspection',
      priority: 103, // Low
    },
  ];

  filteredTasks = [...this.tasks];
  selectedStatus = 'all'; // Default filter
  selectedTask: any = null;
  isModalOpen = false;

  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
    this.filterTasks(); // Show all tasks initially
  }

  filterTasks() {
    console.log('Filtering tasks with status:', this.selectedStatus);

    if (this.selectedStatus === 'all') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter((task) => {
        switch (this.selectedStatus) {
          case 'completed':
            return task.status === 101; // Completed
          case 'in-progress':
            return task.status === 102; // In Progress
          case 'not-started':
            return task.status === 103; // Not Started
          case 'cancelled':
            return task.status === 104; // Cancelled
          default:
            return false;
        }
      });
    }

    console.log('Filtered tasks:', this.filteredTasks);
  }

  updateStatus(task: any) {
    console.log('Update status:', task);
  }
  deleteTask(task: any) {
    console.log('Delete task:', task);
  }

  viewTask(task: any) {
    this.selectedTask = task; // Set selected task details
    this.isModalOpen = true; // Open the modal
  }

  closeModal() {
    this.isModalOpen = false; // Close the modal
  }
  addTask = async () => {
  // Navigate first and wait for it to complete
  await this.router.navigate(['/app_homepage/task/add']);
  // Now toggle the visibility of global header and footer
}
  editTask = async (task: any) => {
    console.log('edit task:', task);
    await this.router.navigate(['/app_homepage/task/add']);
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponentComponent,
      canDismiss: true,
      breakpoints: [0, 0.5,0.7], // Allows dragging between 0% and 50%
      initialBreakpoint: 0.5, // Open at minimum height based on content
      handle: false, // We'll add a custom handle
      cssClass: 'custom-bottom-sheet',
      backdropDismiss: true
    });

    await modal.present();
  }



}
