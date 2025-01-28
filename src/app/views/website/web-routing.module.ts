import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web.component';
import { MaterialMasterComponent } from './Masters/material-master/material-master.component';
import { StageMasterComponent } from './Masters/stage-master/stage-master.component';
import { AccountMainLedgerComponent } from './Masters/account-main-ledger/account-main-ledger.component';
import { AccountSubLedgerComponent } from './Masters/account-sub-ledger/account-sub-ledger.component';
import { MarketingMasterComponent } from './Masters/marketing-master/marketing-master.component';
import { VehicleMasterComponent } from './Masters/vehicle-master/vehicle-master.component';
import { BankMasterComponent } from './Masters/bank-master/bank-master.component';
import { UserMasterComponent } from './Masters/user-master/user-master.component';
import { GovernmentOfficeComponent } from './government_office/government-office/government-office.component';
import { RegistrarOfficeComponent } from './registrar_office/registrar-office/registrar-office.component';
import { PlotResellByThirdPartyComponent } from './plot_resell_by_third_party/plot-resell-by-third-party/plot-resell-by-third-party.component';
import { MarketingManagementComponent } from './marketing_management/marketing-management/marketing-management.component';
import { EmployeeManagementComponent } from './hr_payroll_management/employee-management/employee-management.component';
import { AttendanceAndSalaryComponent } from './hr_payroll_management/attendance-and-salary/attendance-and-salary.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { SiteManagementMasterComponent } from './site-management/site-management-master/site-management-master.component';
import { SiteManagementActualStagesComponent } from './site-management/site-management-actual-stages/site-management-actual-stages.component';
import { EstimateStagesComponent } from './estimate-stages/estimate-stages.component';
import { DepartmentMasterComponent } from './Masters/department-master/department-master.component';
import { UserRoleMasterComponent } from './Masters/user-role-master/user-role-master.component';
import { EmployeeMasterComponent } from './Masters/employee-master/employee-master.component';
import { CompanyMasterComponent } from './Masters/company/company-master/company-master.component';
import { CompanyMasterDetailsComponent } from './Masters/company/company-master-details/company-master-details.component';
import { VendorMasterComponent } from './Masters/vendor/vendor-master/vendor-master.component';
import { VendorMasterDetailsComponent } from './Masters/vendor/vendor-master-details/vendor-master-details.component';
import { SiteManagementDetailsComponent } from './site-management/site-management-details/site-management-details.component';
import { AccountTransactionsComponent } from './Accounting/account-transactions/account-transactions.component';
import { ExpenseTransactionsComponent } from './Accounting/expense-transactions/expense-transactions.component';
import { ClientIncomeComponent } from './Accounting/Income Transactions/client-income/client-income.component';
import { BillingReportComponent } from './Reports/billing-report/billing-report.component';
import { OfficeReportComponent } from './Reports/office-report/office-report.component';
import { BookingReportComponent } from './Reports/booking-report/booking-report.component';
import { StockReportComponent } from './Reports/stock-report/stock-report.component';
import { CrmReportComponent } from './Reports/crm-report/crm-report.component';
import { FollowUpReportComponent } from './Reports/follow-up-report/follow-up-report.component';
import { EmployeeReportComponent } from './Reports/employee-report/employee-report.component';
import { MarketingReportComponent } from './Reports/marketing-report/marketing-report.component';
import { StagesReportComponent } from './Reports/stages-report/stages-report.component';
import { AccountReportComponent } from './Reports/account-report/account-report.component';

const routes: Routes = [
  {
    path: '', component: WebComponent,
    children: [
      {path: 'Dashboard', component: DashboardComponent},
      { path: 'Material_Master', component: MaterialMasterComponent},
      { path: 'Stage_Master', component: StageMasterComponent},
      { path: 'Account_Main_Ledger', component: AccountMainLedgerComponent},
      { path: 'Account_Sub_Ledger', component: AccountSubLedgerComponent},
      { path: 'Marketing_Master', component: MarketingMasterComponent},
      { path: 'Vendor_Master', component: VendorMasterComponent},
      { path: 'Vendor_Master_Details', component: VendorMasterDetailsComponent},
      { path: 'Vehicle_Master', component: VehicleMasterComponent},
      { path: 'Bank_Master', component: BankMasterComponent},
      { path: 'User_Master', component: UserMasterComponent},
      { path: 'Company_Master', component: CompanyMasterComponent},
      { path: 'Company_Master_details', component: CompanyMasterDetailsComponent},
      { path: 'Department_Master', component: DepartmentMasterComponent},
      { path: 'User_Role_Master', component: UserRoleMasterComponent},
      { path: 'Employee_Master', component: EmployeeMasterComponent},
     
      { path: 'Estimate_Stages', component: EstimateStagesComponent},


      { path: 'site_management_Master', component: SiteManagementMasterComponent},
      { path: 'Site_Management_Details', component: SiteManagementDetailsComponent},

      { path: 'site_management_actual_stage', component: SiteManagementActualStagesComponent},


      { path: 'government _Office', component: GovernmentOfficeComponent},
      
      { path: 'Registrar_Office', component: RegistrarOfficeComponent},

      { path: 'Plot_Resell_By_Third_Party', component: PlotResellByThirdPartyComponent},

      { path: 'Marketing_Management', component: MarketingManagementComponent},

      { path: 'Employee_Management', component: EmployeeManagementComponent},
      { path: 'Attendance_and_Salary', component: AttendanceAndSalaryComponent},

      { path: 'Accounting_Transaction', component: AccountTransactionsComponent},
      { path: 'Expense_Transactions', component: ExpenseTransactionsComponent},
      { path: 'Client_Income', component: ClientIncomeComponent},

      { path: 'Billing_Report', component: BillingReportComponent},
      { path: 'Office_Report', component: OfficeReportComponent},
      { path: 'Booking_Report', component: BookingReportComponent},
      { path: 'Stock_Report', component: StockReportComponent},
      { path: 'CRM_Report', component: CrmReportComponent},
      { path: 'Follow_Up_Report', component: FollowUpReportComponent},
      { path: 'Employee_Report', component: EmployeeReportComponent},
      { path: 'Marketing_Report', component: MarketingReportComponent},
      { path: 'Stages_Report', component: StagesReportComponent},
      { path: 'Account_Report', component: AccountReportComponent}

    ]


  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
