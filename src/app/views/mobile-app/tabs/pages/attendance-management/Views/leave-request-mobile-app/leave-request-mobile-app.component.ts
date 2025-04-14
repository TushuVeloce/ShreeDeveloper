import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-request-mobile-app',
  templateUrl: './leave-request-mobile-app.component.html',
  styleUrls: ['./leave-request-mobile-app.component.scss'],
  standalone:false
})
export class LeaveRequestMobileAppComponent  implements OnInit {

  ngOnInit() { }
   tasks = [
     { id: '1', title: 'Task 1', description: 'Description 1' },
     { id: '2', title: 'Task 2', description: 'Description 2' }
   ];
 
   constructor(private router: Router) { }
 
   addTask() {
     this.router.navigate(['/app_homepage/tabs/attendance-management/add-salary-slip']); // ✅ Navigate to Add Page
   }
 
   editTask(taskId: string) {
     this.router.navigate(['/app_homepage/tabs/attendance-management/add-salary-slip']); // ✅ Navigate to Edit Page
   }
 

}
