import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerRelationshipManagementMobileAppPageRoutingModule } from './customer-relationship-management-mobile-app-routing.module';

import { CustomerRelationshipManagementMobileAppPage } from './customer-relationship-management-mobile-app.page';
import { CustomerRelationshipManagementViewMobileAppComponent } from './components/customer-relationship-management-view-mobile-app/customer-relationship-management-view-mobile-app.component';
import { PendingCustomerFollowupMobileAppComponent } from './components/pending-customer-followup-mobile-app/pending-customer-followup-mobile-app.component';
import { LoaderComponent } from "src/app/views/mobile-app/components/shared/loader/loader.component";
import { SharedModule } from "src/app/views/mobile-app/components/shared/shared.module";
import { CustomerInfoReportMobileAppComponent } from './components/customer-info-report-mobile-app/customer-info-report-mobile-app.component';
import { CustomerSummaryReportMobileAppComponent } from './components/customer-summary-report-mobile-app/customer-summary-report-mobile-app.component';
import { CustomerVisitReportMobileAppComponent } from './components/customer-visit-report-mobile-app/customer-visit-report-mobile-app.component';
import { PaymentHistoryMobileAppComponent } from './components/payment-history-mobile-app/payment-history-mobile-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerRelationshipManagementMobileAppPageRoutingModule,
    LoaderComponent,
    SharedModule
],
  declarations: [CustomerRelationshipManagementMobileAppPage,CustomerRelationshipManagementViewMobileAppComponent,PendingCustomerFollowupMobileAppComponent,CustomerInfoReportMobileAppComponent,CustomerSummaryReportMobileAppComponent,CustomerVisitReportMobileAppComponent,PaymentHistoryMobileAppComponent]
})
export class CustomerRelationshipManagementMobileAppPageModule {}
