import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-view-mobile-app',
  templateUrl: './approval-view-mobile-app.component.html',
  styleUrls: ['./approval-view-mobile-app.component.scss'],
  standalone: false,
})
export class ApprovalViewMobileAppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
gridItems = [
    {
      icon: 'assets/icons/leave_approval_mobile_app.png',
      label: 'Leave Approval',
      routerPath: '/mobile-app/tabs/attendance/approvals/leave-approval'
    },
    {
      icon: 'assets/icons/salary_slip_mobile_app.png',
      label: 'Salary Slip Approval',
      routerPath: '/mobile-app/tabs/attendance/approvals/salary-slip-approval'
    },
    { 
      icon: 'assets/icons/attendance_approval_mobile_app.png',
      label: 'Attendance Approval',
      routerPath: '/mobile-app/tabs/attendance/approvals/attendance-approval'
    },
    {
      icon: 'assets/icons/overtime_mobile_app.png',
      label: 'Employee Overtime',
      routerPath: '/mobile-app/tabs/attendance/approvals/employee-overtime'
    },
  ];


  selectedIndex = 0;
  expensePercent = 30;

  selectItem(index: number) {
    this.selectedIndex = index;
  }
}
