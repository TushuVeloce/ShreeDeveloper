import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter.service';
import { AlertService } from '../../core/alert.service';

type Task = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  employeeID: number;
  employeeName: string;
  status: number;
  priority: number;
  expenseTypes: string;
  siteName: string;
  siteRef: number;
};

@Component({
  selector: 'app-task-mobile',
  templateUrl: './task-mobile.page.html',
  styleUrls: ['./task-mobile.page.scss'],
  standalone:false
})
export class TaskMobilePage implements OnInit {

  tasks: Task[] = [
    {
      id: '1',
      title: 'Fix Excavator',
      description: 'Repair hydraulic system',
      start_date: '2025-04-03',
      end_date: '2025-04-03',
      employeeID: 10,
      siteName: 'site1',
      status: 100,
      priority: 200,
      siteRef: 12345,
      employeeName: 'employee1',
      expenseTypes: 'machinery'
    },
    {
      id: '2',
      title: 'Site Survey Initial site inspection',
      description: 'Initial site inspection',
      start_date: '2025-04-02',
      end_date: '2025-04-02',
      employeeID: 20,
      employeeName: 'employee1',
      status: 101,
      expenseTypes: 'labour',
      priority: 202,
      siteRef: 12345,
      siteName: 'site1',
    },
    {
      id: '3',
      title: 'Foundation Setup',
      description: 'Concrete foundation for building A',
      start_date: '2025-03-30',
      end_date: '2025-03-30',
      employeeID: 30,
      employeeName: 'employee1',
      status: 100,
      siteName: 'site1',
      priority: 201,
      siteRef: 12345,
      expenseTypes: 'other'
    },
    {
      id: '4',
      title: 'Purchase Materials',
      description: 'Order steel and cement',
      start_date: '2025-04-04',
      end_date: '2025-04-04',
      employeeID: 10,
      employeeName: 'employee2',
      status: 103,
      siteName: 'site1',
      siteRef: 12345,
      priority: 203,
      expenseTypes: 'machinery'
    },
    {
      id: '5',
      title: 'Electrical Wiring',
      description: 'Install wiring in floor 2',
      start_date: '2025-03-28',
      end_date: '2025-03-28',
      employeeID: 20,
      employeeName: 'employee2',
      status: 102,
      siteName: 'site4',
      priority: 201,
      siteRef: 12345,
      expenseTypes: 'labour'
    },
    {
      id: '6',
      title: 'Roof Work',
      description: 'Start with tiling the roof',
      start_date: '2025-04-01',
      end_date: '2025-04-01',
      employeeID: 30,
      employeeName: 'employee1',
      status: 101,
      siteName: 'site3',
      priority: 202,
      siteRef: 12345,
      expenseTypes: 'other'
    },
    {
      id: '7',
      title: 'Paint Exterior Walls',
      description: 'Blue & white color scheme',
      start_date: '2025-03-27',
      end_date: '2025-03-27',
      employeeID: 10,
      employeeName: 'employee2',
      status: 103,
      priority: 200,
      siteName: 'site2',
      siteRef: 12345,
      expenseTypes: 'labour'
    }
  ];

  highPriorityTasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedFilters: any[] = [];
  // selectedFilters: any[] = [];
  selectedTab: string = 'in_progress';

  filters: any[] = [
    {
      value: 'date',
      label: 'Date',
      options: [
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'last_week', label: 'Last Week' },
        { value: 'custom_date', label: 'Custom Date' }
      ]
    },
    {
      value: 'assignTo',
      label: 'Assign To',
      options: [
        { value: 10, label: 'John Doe' },
        { value: 20, label: 'Alice Smith' },
        { value: 30, label: 'Bob Johnson' }
      ]
    },
    {
      value: 'status',
      label: 'Status',
      options: [
        { value: 100, label: 'Not Started' },
        { value: 101, label: 'In Progress' },
        { value: 102, label: 'Completed' },
        { value: 103, label: 'Cancelled' }
      ]
    }
  ];

  statusOptions = [
    { value: 100, label: 'Not Started' },
    { value: 101, label: 'In Progress' },
    { value: 102, label: 'Completed' },
    { value: 103, label: 'Cancelled' }
  ];

  priorityOptions = [
    { value: 200, label: 'High' },
    { value: 201, label: 'Medium' },
    { value: 202, label: 'Low' },
  ];
  getPriorityLabel(status: number): string {
    const found = this.priorityOptions.find(opt => opt.value === status);
    return found ? found.label : 'Unknown';
  }
  getStatusLabel(status: number): string {
    const found = this.statusOptions.find(opt => opt.value === status);
    return found ? found.label : 'Unknown';
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 102:
        return 'success';
      case 101:
        return 'warning';
      case 101:
        return 'medium';
      case 103:
        return 'danger';
      default:
        return 'light';
    }
  }

  updateTaskStatus(task: any) {
    // Call your API or service to update the task's status
    // Example:
    // this.taskService.updateStatus(task.id, task.status).subscribe(...)
  }


  constructor(private router: Router, private modalCtrl: ModalController, private filterService: FilterService, private alertService: AlertService) { }

  ngOnInit() {
    this.highPriorityTasks = this.tasks.filter(task => task.priority === 200);
    this.filteredTasks = [...this.tasks];
    this.filterTasks();
  }


  addTask() {
    this.router.navigate(['mobileapp/tabs/task/add']);
    // this.router.navigate(['mobileapp/tabs/task/add'], { replaceUrl: true });
  }

  editTask(taskId: string) {
    this.alertService.presentDynamicAlert({
      header: 'Are you sure?',
      subHeader: 'Confirmation needed',
      message: 'This action will delete your data permanently.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'custom-cancel',
          handler: () => {
            console.log('User cancelled.');
          }
        },
        {
          text: 'Yes, Delete',
          cssClass: 'custom-confirm',
          handler: () => {
            console.log('User confirmed deletion.');
            // perform deletion logic here
            this.router.navigate(['mobileapp/tabs/task/edit']);
          }
        }
      ]
    });

  }

  // selectedFilters:any = {};

  openFilterSheet() {
    const filterData = {
      categories: [
        {
          Name: 'Brand',
          Ref: 100,
          multi: true,
          options: [
            { Ref: 101, Name: 'Apple' },
            { Ref: 102, Name: 'Samsung' },
            { Ref: 103, Name: 'OnePlus' },
            { Ref: 104, Name: 'Vivo' },
            { Ref: 105, Name: 'Apple' },
            { Ref: 106, Name: 'Samsung' },
            { Ref: 107, Name: 'OnePlus' },
            { Ref: 108, Name: 'Vivo' }
          ]
        },
        {
          Name: 'RAM',
          Ref: 200,
          multi: false,
          options: [
            { Ref: 201, Name: '4GB' },
            { Ref: 202, Name: '6GB' },
            { Ref: 203, Name: '8GB' }
          ]
        },
        {
          Name: 'Storage',
          Ref: 300,
          multi: true,
          options: [
            { Ref: 301, Name: '40GB' },
            { Ref: 302, Name: '60GB' },
            { Ref: 303, Name: '80GB' }
          ]
        }
      ]
    };


    // this.filterService.openFilter(filterData, this.selectedFilters).then(res => {
    //   if (res?.selected) {
    //     this.selectedFilters = res.selected;
    //     console.log('Filters applied:', this.selectedFilters);
    //     // Apply filter logic here...
    //   }
    // });
    console.log(' this.selectedFilters :', this.selectedFilters);
    this.filterService.openFilter(filterData, this.selectedFilters).then(res => {
      if (res?.selected) {
        this.selectedFilters = res.selected;
        console.log(' this.selectedFilters :', this.selectedFilters);
      }
    });
  }

  // async openFilterModal() {
  //   const modal = await this.modalCtrl.create({
  //     component: FilterBottomsheetComponent,
  //     componentProps: {
  //       filters: this.filters,
  //       currentFilters: this.selectedFilters
  //     },
  //     breakpoints: [0, 0.5, 1],
  //     initialBreakpoint: 0.5
  //   });

  //   await modal.present();
  //   const { data } = await modal.onWillDismiss();

  //   if (data?.filters) {
  //     this.selectedFilters = data.filters;
  //     this.applyFilters();
  //   }
  // }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      return Object.entries(this.selectedFilters).every(([key, selectedValue]) => {
        if (!selectedValue || selectedValue) return true;

        const taskValue = (task as any)[key]; // Use if unsure of key type
        const selectedArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue];

        if (key === 'date') {
          return this.isDateMatch(task.end_date, selectedArray);
        }

        return selectedArray.includes(taskValue);
      });
    });

    this.filterTasks();
  }


  isDateMatch(taskDate: string, selectedValues: string[]): boolean {
    const today = new Date();
    const date = new Date(taskDate);

    for (const val of selectedValues) {
      if (val === 'today' && date.toDateString() === today.toDateString()) return true;

      if (val === 'yesterday') {
        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        if (date.toDateString() === yest.toDateString()) return true;
      }

      if (val === 'last_week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        if (date >= lastWeek && date <= today) return true;
      }
    }

    return false;
  }

  getFilterKeys(): string[] {
    return Object.keys(this.selectedFilters);
  }

  filterTasks() {
    if (this.selectedTab === 'in_progress') {
      this.filteredTasks = this.tasks.filter(t => t.status === 101);
    } else if (this.selectedTab === 'completed') {
      this.filteredTasks = this.tasks.filter(t => t.status === 102);
    } else if (this.selectedTab === 'cancelled') {
      this.filteredTasks = this.tasks.filter(t => t.status === 103);
    } else {
      this.filteredTasks = [...this.tasks]; // All tasks
    }
  }
}
