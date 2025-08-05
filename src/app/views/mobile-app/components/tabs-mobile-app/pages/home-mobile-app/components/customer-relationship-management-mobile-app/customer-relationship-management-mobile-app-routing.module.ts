import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerRelationshipManagementMobileAppPage } from './customer-relationship-management-mobile-app.page';
import { CustomerRelationshipManagementViewMobileAppComponent } from './components/customer-relationship-management-view-mobile-app/customer-relationship-management-view-mobile-app.component';
import { PendingCustomerFollowupMobileAppComponent } from './components/pending-customer-followup-mobile-app/pending-customer-followup-mobile-app.component';
import { CustomerInfoReportMobileAppComponent } from './components/customer-info-report-mobile-app/customer-info-report-mobile-app.component';
import { CustomerSummaryReportMobileAppComponent } from './components/customer-summary-report-mobile-app/customer-summary-report-mobile-app.component';
import { CustomerVisitReportMobileAppComponent } from './components/customer-visit-report-mobile-app/customer-visit-report-mobile-app.component';
import { PaymentHistoryMobileAppComponent } from './components/payment-history-mobile-app/payment-history-mobile-app.component';
import { DealCancelledCustomerReportMobileAppComponent } from './components/deal-cancelled-customer-report-mobile-app/deal-cancelled-customer-report-mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerRelationshipManagementMobileAppPage,
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', component: CustomerRelationshipManagementViewMobileAppComponent },
      { path: 'pending-customer-followup', component: PendingCustomerFollowupMobileAppComponent },
      { path: 'customer-info-report', component: CustomerInfoReportMobileAppComponent },
      { path: 'customer-summary-report', component: CustomerSummaryReportMobileAppComponent },
      { path: 'customer-visit-report', component: CustomerVisitReportMobileAppComponent },
      { path: 'payment-history-report', component: PaymentHistoryMobileAppComponent },
      { path: 'deal-cancelled-customer-report', component: DealCancelledCustomerReportMobileAppComponent },
      {
        path: 'customer-enquiry',
        loadChildren: () => import('./components/customer-enquiry-mobile-app/customer-enquiry-mobile-app.module').then(m => m.CustomerEnquiryMobileAppPageModule)
      },
      {
        path: 'customer-followup',
        loadChildren: () => import('./components/customer-followup-mobile-app/customer-followup-mobile-app.module').then(m => m.CustomerFollowupMobileAppPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRelationshipManagementMobileAppPageRoutingModule { }
