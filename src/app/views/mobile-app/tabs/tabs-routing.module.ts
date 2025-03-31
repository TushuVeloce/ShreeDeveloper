import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
      { path: 'task-management', loadChildren: () => import('./pages/task-management/task-management.module').then(m => m.TaskManagementPageModule) },
      { path: 'attendance-management', loadChildren: () => import('./pages/attendance-management/attendance-management.module').then(m => m.AttendanceManagementPageModule) },
      { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
   // Global Pages (Non-Tab Pages)
    { path: 'site-management', loadChildren: () => import('../screens/site-management/site-management.module').then(m => m.SiteManagementPageModule) },
    { path: 'stock-management', loadChildren: () => import('../screens/stock-management/stock-management.module').then(m => m.StockManagementPageModule) },
    { path: 'marketing-management', loadChildren: () => import('../screens/marketing-management/marketing-management.module').then(m => m.MarketingManagementPageModule) },
    { path: 'report', loadChildren: () => import('../screens/report/report.module').then(m => m.ReportPageModule) },
    { path: 'crm', loadChildren: () => import('../screens/crm/crm.module').then(m => m.CRMPageModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
