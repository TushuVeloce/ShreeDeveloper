import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'task-mobile',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'task-mobile',
  //   loadChildren: () => import('./task-mobile/task-mobile.module').then(m => m.TaskMobilePageModule)
  // },
  // {
  //   path: 'task-details-mobile',
  //   loadChildren: () => import('./task-details-mobile/task-details-mobile.module').then(m => m.TaskDetailsMobilePageModule)
  // },
  // {
  //   path: 'site-management-mobile',
  //   loadChildren: () => import('./site-management-mobile/site-management-mobile.module').then( m => m.SiteManagementMobilePageModule)
  // },
  // {
  //   path: 'marketing-management-mobile',
  //   loadChildren: () => import('./marketing-management-mobile/marketing-management-mobile.module').then( m => m.MarketingManagementMobilePageModule)
  // },
  // {
  //   path: 'customer-relationship-management-mobile',
  //   loadChildren: () => import('./customer-relationship-management-mobile/customer-relationship-management-mobile.module').then( m => m.CustomerRelationshipManagementMobilePageModule)
  // },
  // {
  //   path: 'salary-slip-mobile',
  //   loadChildren: () => import('./salary-slip-mobile/salary-slip-mobile.module').then( m => m.SalarySlipMobilePageModule)
  // },
  // {
  //   path: 'salary-slip-details-mobile',
  //   loadChildren: () => import('./salary-slip-details-mobile/salary-slip-details-mobile.module').then( m => m.SalarySlipDetailsMobilePageModule)
  // },
  // {
  //   path: 'leave-mobile',
  //   loadChildren: () => import('./leave-mobile/leave-mobile.module').then( m => m.LeaveMobilePageModule)
  // },
  // {
  //   path: 'leave-details-mobile',
  //   loadChildren: () => import('./leave-details-mobile/leave-details-mobile.module').then( m => m.LeaveDetailsMobilePageModule)
  // },
  // {
  //   path: 'attendance-details-mobile',
  //   loadChildren: () => import('./attendance-details-mobile/attendance-details-mobile.module').then( m => m.AttendanceDetailsMobilePageModule)
  // }

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
