import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web.component';
import { MaterialMasterComponent } from './Masters/material-master/material-master.component';
import { StageMasterComponent } from './Masters/stage-master/stage-master.component';
import { AccountMainLedgerComponent } from './Masters/account-main-ledger/account-main-ledger.component';
import { AccountSubLedgerComponent } from './Masters/account-sub-ledger/account-sub-ledger.component';
import { MarketingMasterComponent } from './Masters/marketing-master/marketing-master.component';
import { VendorMasterComponent } from './Masters/vendor-master/vendor-master.component';
import { VehicleMasterComponent } from './Masters/vehicle-master/vehicle-master.component';
import { BankMasterComponent } from './Masters/bank-master/bank-master.component';
import { UserMasterComponent } from './Masters/user-master/user-master.component';
import { GovernmentOfficeComponent } from './government_office/government-office/government-office.component';
import { RegistrarOfficeComponent } from './registrar_office/registrar-office/registrar-office.component';
import { PlotResellByThirdPartyComponent } from './plot_resell_by_third_party/plot-resell-by-third-party/plot-resell-by-third-party.component';
import { MarketingManagementComponent } from './marketing_management/marketing-management/marketing-management.component';
import { EmployeeManagementComponent } from './hr_payroll_management/employee-management/employee-management.component';
import { AttendanceAndSalaryComponent } from './hr_payroll_management/attendance-and-salary/attendance-and-salary.component';
import { AccountTransactionsComponent } from './accounting/account-transactions/account-transactions.component';
import { ExpenseTransactionsComponent } from './accounting/expense-transactions/expense-transactions.component';
import { ClientIncomeComponent } from './accounting/Income Transactions/client-income/client-income.component';
import { BillingReportComponent } from './reports/billing-report/billing-report.component';
import { OfficeReportComponent } from './reports/office-report/office-report.component';
import { BookingReportComponent } from './reports/booking-report/booking-report.component';
import { StockReportComponent } from './reports/stock-report/stock-report.component';
import { CrmReportComponent } from './reports/crm-report/crm-report.component';
import { FollowUpReportComponent } from './reports/follow-up-report/follow-up-report.component';
import { MarketingReportComponent } from './reports/marketing-report/marketing-report.component';
import { StagesReportComponent } from './reports/stages-report/stages-report.component';
import { AccountReportComponent } from './reports/account-report/account-report.component';
import { EmployeeReportComponent } from './reports/employee-report/employee-report.component';
import { DashboardComponent } from './Dashboard/dashboard.component';

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
      { path: 'Vehicle_Master', component: VehicleMasterComponent},
      { path: 'Bank_Master', component: BankMasterComponent},
      { path: 'User_Master', component: UserMasterComponent},


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
