import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web.component';
import { GovernmentOfficeComponent } from './government_office/government-office/government-office.component';
import { RegistrarOfficeComponent } from './registrar_office/registrar-office/registrar-office.component';
import { PlotResellByThirdPartyComponent } from './plot_resell_by_third_party/plot-resell-by-third-party/plot-resell-by-third-party.component';
import { MarketingManagementComponent } from './marketing_management/marketing-management/marketing-management.component';
import { EmployeeManagementComponent } from './hr_payroll_management/employee-management/employee-management.component';
import { AttendanceAndSalaryComponent } from './hr_payroll_management/attendance-and-salary/attendance-and-salary.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { SiteManagementMasterComponent } from './site-management/site-management-master/site-management-master.component';
import { SiteManagementActualStagesComponent } from './site-management/site-management-actual-stages/site-management-actual-stages.component';
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
import { VehicleMasterComponent } from './Masters/vehicle/vehicle-master/vehicle-master.component';
import { VehicleMasterDetailsComponent } from './Masters/vehicle/vehicle-master-details/vehicle-master-details.component';
import { MaterialMasterComponent } from './Masters/material/material-master/material-master.component';
import { MaterialMasterDetailsComponent } from './Masters/material/material-master-details/material-master-details.component';
import { StageMasterComponent } from './Masters/stage/stage-master/stage-master.component';
import { StageMasterDetailsComponent } from './Masters/stage/stage-master-details/stage-master-details.component';
import { AccountMainLedgerComponent } from './Masters/account_main_ledger/account-main-ledger/account-main-ledger.component';
import { AccountMainLedgerDetailsComponent } from './Masters/account_main_ledger/account-main-ledger-details/account-main-ledger-details.component';
import { AccountSubLedgerComponent } from './Masters/account_sub_ledger/account-sub-ledger/account-sub-ledger.component';
import { AccountSubLedgerDetailsComponent } from './Masters/account_sub_ledger/account-sub-ledger-details/account-sub-ledger-details.component';
import { MarketingMasterComponent } from './Masters/marketing/marketing-master/marketing-master.component';
import { MarketingMasterDetailsComponent } from './Masters/marketing/marketing-master-details/marketing-master-details.component';
import { BankMasterComponent } from './Masters/bank/bank-master/bank-master.component';
import { BankMasterDetailsComponent } from './Masters/bank/bank-master-details/bank-master-details.component';
import { UserMasterComponent } from './Masters/user/user-master/user-master.component';
import { UserMasterDetailsComponent } from './Masters/user/user-master-details/user-master-details.component';
import { DepartmentMasterComponent } from './Masters/department/department-master/department-master.component';
import { DepartmentMasterDetailsComponent } from './Masters/department/department-master-details/department-master-details.component';
import { UserRoleMasterComponent } from './Masters/user_role/user-role-master/user-role-master.component';
import { UserRoleMasterDetailsComponent } from './Masters/user_role/user-role-master-details/user-role-master-details.component';
import { EmployeeMasterComponent } from './Masters/employee/employee-master/employee-master.component';
import { EmployeeMasterDetailsComponent } from './Masters/employee/employee-master-details/employee-master-details.component';
import { SiteManagementActualStagesDetailsComponent } from './site-management/site-management-actual-stages-details/site-management-actual-stages-details.component';
import { EstimateStagesComponent } from './estimate_stages/estimate-stages/estimate-stages.component';
import { EstimateStagesDetailsComponent } from './estimate_stages/estimate-stages-details/estimate-stages-details.component';
import { MaterialRequisitionComponent } from './stock management/material-requisition/material-requisition.component';
import { StockConsumeComponent } from './stock management/stock-consume/stock-consume.component';
import { StockInwardComponent } from './stock management/stock-inward/stock-inward.component';
import { StockOrderComponent } from './stock management/stock-order/stock-order.component';
import { StockTransferComponent } from './stock management/stock-transfer/stock-transfer.component';
import { CountryComponent } from './Masters/country/country.component';
import { StateComponent } from './Masters/state/state.component';
import { CityComponent } from './Masters/city/city.component';
import { UnitMasterComponent } from './Masters/unit/unit-master/unit-master.component';
import { UnitMasterDetailsComponent } from './Masters/unit/unit-master-details/unit-master-details.component';

const routes: Routes = [
  {
    path: '', component: WebComponent,
    children: [
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Unit_Master', component: UnitMasterComponent },
      { path: 'Unit_Master_details', component: UnitMasterDetailsComponent },
      { path: 'Material_Master', component: MaterialMasterComponent },
      { path: 'Material_Master_details', component: MaterialMasterDetailsComponent },
      { path: 'Stage_Master', component: StageMasterComponent },
      { path: 'Stage_Master_Details', component: StageMasterDetailsComponent },
      { path: 'Account_Main_Ledger', component: AccountMainLedgerComponent },
      { path: 'Account_Main_Ledger_Details', component: AccountMainLedgerDetailsComponent },
      { path: 'Account_Sub_Ledger', component: AccountSubLedgerComponent },
      { path: 'Account_Sub_Ledger_Details', component: AccountSubLedgerDetailsComponent },
      { path: 'Marketing_Master', component: MarketingMasterComponent },
      { path: 'Marketing_Master_Details', component: MarketingMasterDetailsComponent },
      { path: 'Vendor_Master', component: VendorMasterComponent },
      { path: 'Vendor_Master_Details', component: VendorMasterDetailsComponent },
      { path: 'Vehicle_Master', component: VehicleMasterComponent },
      { path: 'Vehicle_Master_Details', component: VehicleMasterDetailsComponent },
      { path: 'Bank_Master', component: BankMasterComponent },
      { path: 'Bank_Master_Details', component: BankMasterDetailsComponent },
      { path: 'User_Master', component: UserMasterComponent },
      { path: 'User_Master_Details', component: UserMasterDetailsComponent },
      { path: 'Company_Master', component: CompanyMasterComponent },
      { path: 'Company_Master_Details', component: CompanyMasterDetailsComponent },
      { path: 'Department_Master', component: DepartmentMasterComponent },
      { path: 'Department_Master_Details', component: DepartmentMasterDetailsComponent },
      { path: 'User_Role_Master', component: UserRoleMasterComponent },
      { path: 'User_Role_Master_Details', component: UserRoleMasterDetailsComponent },
      { path: 'Employee_Master', component: EmployeeMasterComponent },
      { path: 'Employee_Master_Details', component: EmployeeMasterDetailsComponent },

      { path: 'Estimate_Stages', component: EstimateStagesComponent },
      { path: 'Estimate_Stages_details', component: EstimateStagesDetailsComponent },
      
      { path: 'Country', component: CountryComponent },
      { path: 'State', component: StateComponent },
      { path: 'City', component: CityComponent },

      // Site management 
      { path: 'site_management_Master', component: SiteManagementMasterComponent },
      { path: 'Site_Management_Details', component: SiteManagementDetailsComponent },

      { path: 'site_management_actual_stage', component: SiteManagementActualStagesComponent },
      { path: 'Site_Management_Actual_Stage_Details', component: SiteManagementActualStagesDetailsComponent },

      // Stock Management 
      { path: 'Material_Requisition', component: MaterialRequisitionComponent },
      { path: 'Stock_Consume', component: StockConsumeComponent },
      { path: 'Stock_Inward', component: StockInwardComponent },
      { path: 'Stock_Order', component: StockOrderComponent },
      { path: 'Stock_Transfer', component: StockTransferComponent },


      { path: 'government _Office', component: GovernmentOfficeComponent },

      { path: 'Registrar_Office', component: RegistrarOfficeComponent },

      { path: 'Plot_Resell_By_Third_Party', component: PlotResellByThirdPartyComponent },

      { path: 'Marketing_Management', component: MarketingManagementComponent },

      { path: 'Employee_Management', component: EmployeeManagementComponent },
      { path: 'Attendance_and_Salary', component: AttendanceAndSalaryComponent },

      { path: 'Accounting_Transaction', component: AccountTransactionsComponent },
      { path: 'Expense_Transactions', component: ExpenseTransactionsComponent },
      { path: 'Client_Income', component: ClientIncomeComponent },

      { path: 'Billing_Report', component: BillingReportComponent },
      { path: 'Office_Report', component: OfficeReportComponent },
      { path: 'Booking_Report', component: BookingReportComponent },
      { path: 'Stock_Report', component: StockReportComponent },
      { path: 'CRM_Report', component: CrmReportComponent },
      { path: 'Follow_Up_Report', component: FollowUpReportComponent },
      { path: 'Employee_Report', component: EmployeeReportComponent },
      { path: 'Marketing_Report', component: MarketingReportComponent },
      { path: 'Stages_Report', component: StagesReportComponent },
      { path: 'Account_Report', component: AccountReportComponent }

    ]


  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
