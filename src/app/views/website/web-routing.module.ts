import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web.component';
import { RegistrarOfficeComponent } from './registrar_office/registrar-office/registrar-office.component';
import { PlotResellByThirdPartyComponent } from './plot_resell_by_third_party/plot-resell-by-third-party/plot-resell-by-third-party.component';
import { MarketingManagementComponent } from './marketing_management/marketing-management/marketing-management.component';
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
import { UserrolerightsComponent } from './Masters/userrolerights/userrolerights.component';
import { FinancialYearMasterComponent } from './Masters/financial-year-master/financial-year-master.component';
import { VendorServicesMasterComponent } from './Masters/vendor_services/vendor-services-master/vendor-services-master.component';
import { VendorServicesMasterDetailsComponent } from './Masters/vendor_services/vendor-services-master-details/vendor-services-master-details.component';
import { BankAccountMasterComponent } from './Masters/bank_account/bank-account-master/bank-account-master.component';
import { BankAccountMasterDetailsComponent } from './Masters/bank_account/bank-account-master-details/bank-account-master-details.component';
import { MarketingTypeMasterComponent } from './Masters/marketing_type/marketing-type-master/marketing-type-master.component';
import { MarketingTypeMasterDetailsComponent } from './Masters/marketing_type/marketing-type-master-details/marketing-type-master-details.component';
import { ExternalUsersComponent } from './Masters/external_users/external-users/external-users.component';
import { ExternalUsersMasterDetailsComponent } from './Masters/external_users/external-users-details/external-users-details.component';
import { DesignationMasterComponent } from './Masters/designation/designation-master/designation-master.component';
import { DesignationMasterDetailsComponent } from './Masters/designation/designation-master-details/designation-master-details.component';
import { EmployeeAppraisalDetailsComponent } from './Masters/employee_appraisal/employee-appraisal-details/employee-appraisal-details.component';
import { EmployeeAppraisalMasterComponent } from './Masters/employee_appraisal/employee-appraisal-master/employee-appraisal-master.component';
import { EmployeeExitDetailsComponent } from './Masters/employee_exit/employee-exit-details/employee-exit-details.component';
import { EmployeeExitMasterComponent } from './Masters/employee_exit/employee-exit-master/employee-exit-master.component';
import { PlotMasterDetailsComponent } from './site-management/plot_details/plot-master-details/plot-master-details.component';
import { PlotMasterComponent } from './site-management/plot_details/plot-master/plot-master.component';
import { CustomerEnquiryComponent } from './customer_management/presale/customer_enquiry/customer-enquiry/customer-enquiry.component';
import { CustomerEnquiryDetailsComponent } from './customer_management/presale/customer_enquiry/customer-enquiry-details/customer-enquiry-details.component';
import { CustomerFollowupComponent } from './customer_management/presale/customer_followup/customer-followup/customer-followup.component';
import { CustomerFollowupDetailsComponent } from './customer_management/presale/customer_followup/customer-followup-details/customer-followup-details.component';
import { RegisteredCustomerComponent } from './customer_management/presale/registered_customer/registered-customer/registered-customer.component';
import { RegisteredCustomerDetailsComponent } from './customer_management/presale/registered_customer/registered-customer-details/registered-customer-details.component';
import { RegistrarOfficeDetailComponent } from './registrar_office/registrar-office-detail/registrar-office-detail.component';

import { OfficeDutyTimeComponent } from './hr_payroll_management/office_duty_time/office-duty-time/office-duty-time.component';
import { OfficeDutyTimeDetailsComponent } from './hr_payroll_management/office_duty_time/office-duty-time-details/office-duty-time-details.component';
import { DocumentListComponent } from './government_office_masters/document/document-list/document-list.component';
import { DocumentDetailsComponent } from './government_office_masters/document/document-details/document-details.component';
import { SiteWorkMasterComponent } from './government_office_masters/siteworkmaster/site-work-master/site-work-master.component';
import { SiteWorkMasterDetailComponent } from './government_office_masters/siteworkmaster/site-work-master-detail/site-work-master-detail.component';
import { SiteWorkGroupMasterComponent } from './government_office_masters/site_work_group/site-work-group-master/site-work-group-master.component';
import { SiteWorkGroupMasterDetailsComponent } from './government_office_masters/site_work_group/site-work-group-master-details/site-work-group-master-details.component';
import { SiteWorkDoneMasterComponent } from './government_office_masters/site_work_done/site-work-done-master/site-work-done-master.component';
import { SiteWorkDoneMasterDetailsComponent } from './government_office_masters/site_work_done/site-work-done-master-details/site-work-done-master-details.component';
import { ProgressReportComponent } from './government_office_masters/progress_report/progress-report.component';
import { RespectedChildComponentComponent } from './government_transaction/respected-child-component/respected-child-component.component';
import { GovernmentTransactionMasterComponent } from './government_transaction/government-transaction-master/government-transaction-master.component';
import { GovernmentTransactionDetailsComponent } from './government_transaction/government-transaction-details/government-transaction-details.component';
import { SalaryGenerationComponent } from './hr_payroll_management/salary_generation/salary-generation/salary-generation.component';
import { SalaryGenerationDetailsComponent } from './hr_payroll_management/salary_generation/salary-generation-details/salary-generation-details.component';
import { LeaveApprovalComponent } from './hr_payroll_management/leave-approval/leave-approval.component';
import { SalarySlipApprovalComponent } from './hr_payroll_management/salary-slip-approval/salary-slip-approval.component';
import { AttendanceLogsComponent } from './hr_payroll_management/attendance_logs/attendance-logs/attendance-logs.component';
import { LeaveRequestComponent } from './employee_request/leave_request/leave-request/leave-request.component';
import { LeaveRequestDetailsComponent } from './employee_request/leave_request/leave-request-details/leave-request-details.component';
import { SalarySlipRequestComponent } from './employee_request/salary_slip_request/salary-slip-request/salary-slip-request.component';
import { SalarySlipRequestDetailsComponent } from './employee_request/salary_slip_request/salary-slip-request-details/salary-slip-request-details.component';
import { EmployeeAttendanceLogsComponent } from './employee_request/employee_attendance_logs/employee-attendance-logs/employee-attendance-logs.component';
import { RazorpayComponent } from './Razorpay/razorpay/razorpay.component';


const routes: Routes = [
  {
    path: '', component: WebComponent,
    children: [
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Unit_Master', component: UnitMasterComponent },
      { path: 'Unit_Master_Details', component: UnitMasterDetailsComponent },

      { path: 'Material_Master', component: MaterialMasterComponent },
      { path: 'Material_Master_Details', component: MaterialMasterDetailsComponent },

      { path: 'Stage_Master', component: StageMasterComponent },
      { path: 'Stage_Master_Details', component: StageMasterDetailsComponent },

      { path: 'Account_Main_Ledger', component: AccountMainLedgerComponent },
      { path: 'Account_Main_Ledger_Details', component: AccountMainLedgerDetailsComponent },

      { path: 'Account_Sub_Ledger', component: AccountSubLedgerComponent },
      { path: 'Account_Sub_Ledger_Details', component: AccountSubLedgerDetailsComponent },

      { path: 'Marketing_Type_Master', component: MarketingTypeMasterComponent },
      { path: 'Marketing_Type_Master_Details', component: MarketingTypeMasterDetailsComponent },

      { path: 'Vendor_Master', component: VendorMasterComponent },
      { path: 'Vendor_Master_Details', component: VendorMasterDetailsComponent },

      { path: 'Vendor_Services_Master', component: VendorServicesMasterComponent },
      { path: 'Vendor_Services_Master_Details', component: VendorServicesMasterDetailsComponent },

      { path: 'Vehicle_Master', component: VehicleMasterComponent },
      { path: 'Vehicle_Master_Details', component: VehicleMasterDetailsComponent },

      { path: 'Bank_Account_Master', component: BankAccountMasterComponent },
      { path: 'Bank_Account_Master_Details', component: BankAccountMasterDetailsComponent },

      { path: 'External_Users', component: ExternalUsersComponent },
      { path: 'External_Users_Details', component: ExternalUsersMasterDetailsComponent },

      { path: 'Company_Master', component: CompanyMasterComponent },
      { path: 'Company_Master_Details', component: CompanyMasterDetailsComponent },

      { path: 'Department_Master', component: DepartmentMasterComponent },
      { path: 'Department_Master_Details', component: DepartmentMasterDetailsComponent },

      { path: 'Designation_Master', component: DesignationMasterComponent },
      { path: 'Designation_Master_Details', component: DesignationMasterDetailsComponent },

      { path: 'User_Role_Master', component: UserRoleMasterComponent },
      { path: 'User_Role_Master_Details', component: UserRoleMasterDetailsComponent },

      { path: 'Employee_Master', component: EmployeeMasterComponent },
      { path: 'Employee_Master_Details', component: EmployeeMasterDetailsComponent },

      { path: 'Employee_Appraisal_Master_Details', component: EmployeeAppraisalDetailsComponent },
      { path: 'Employee_Appraisal_Master', component: EmployeeAppraisalMasterComponent },

      { path: 'Employee_Exit_Master_Details', component: EmployeeExitDetailsComponent },
      { path: 'Employee_Exit_Master', component: EmployeeExitMasterComponent },

      { path: 'Estimate_Stages', component: EstimateStagesComponent },
      { path: 'Estimate_Stages_details', component: EstimateStagesDetailsComponent },

      { path: 'Country', component: CountryComponent },
      { path: 'State', component: StateComponent },
      { path: 'City', component: CityComponent },
      { path: 'User_Role_Rights', component: UserrolerightsComponent },

      { path: 'Financial_Year_Master', component: FinancialYearMasterComponent },

      // Site management
      { path: 'Plot_Master', component: PlotMasterComponent },
      { path: 'Plot_Master_Details', component: PlotMasterDetailsComponent },


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

      // Customer Management
      { path: 'Customer_Enquiry', component: CustomerEnquiryComponent },
      { path: 'Customer_Enquiry_Details', component: CustomerEnquiryDetailsComponent },

      { path: 'Customer_FollowUp', component: CustomerFollowupComponent },
      { path: 'Customer_FollowUp_Details', component: CustomerFollowupDetailsComponent },

      { path: 'Registered_Customer', component: RegisteredCustomerComponent },
      { path: 'Registered_Customer_Details', component: RegisteredCustomerDetailsComponent },


      //Registrar Office

      { path: 'Registrar_Office', component: RegistrarOfficeComponent },
      { path: 'Registrar_Office_Details', component: RegistrarOfficeDetailComponent },

      { path: 'Plot_Resell_By_Third_Party', component: PlotResellByThirdPartyComponent },
      { path: 'Marketing_Management', component: MarketingManagementComponent },
      { path: 'Accounting_Transaction', component: AccountTransactionsComponent },
      { path: 'Expense_Transactions', component: ExpenseTransactionsComponent },
      { path: 'Client_Income', component: ClientIncomeComponent },

      // Reports
      { path: 'Billing_Report', component: BillingReportComponent },
      { path: 'Office_Report', component: OfficeReportComponent },
      { path: 'Booking_Report', component: BookingReportComponent },
      { path: 'Stock_Report', component: StockReportComponent },
      { path: 'CRM_Report', component: CrmReportComponent },
      { path: 'Follow_Up_Report', component: FollowUpReportComponent },
      { path: 'Employee_Report', component: EmployeeReportComponent },
      { path: 'Marketing_Report', component: MarketingReportComponent },
      { path: 'Stages_Report', component: StagesReportComponent },
      { path: 'Account_Report', component: AccountReportComponent },

      // HR Payroll Management

      { path: 'Office_Duty_Time', component: OfficeDutyTimeComponent },
      { path: 'Office_Duty_Time_Details', component: OfficeDutyTimeDetailsComponent },

      { path: 'Attendance_Logs', component: AttendanceLogsComponent },

      { path: 'Salary_Generation', component: SalaryGenerationComponent },
      { path: 'Salary_Generation_Details', component: SalaryGenerationDetailsComponent },

      { path: 'Leave_Approval', component: LeaveApprovalComponent },

      { path: 'Salary_Slip_Approval', component: SalarySlipApprovalComponent },

      // Request
      { path: 'Leave_Request', component: LeaveRequestComponent },
      { path: 'Leave_Request_Details', component: LeaveRequestDetailsComponent },

      { path: 'Salary_Slip_Request', component: SalarySlipRequestComponent },
      { path: 'Salary_Slip_Request_Details', component: SalarySlipRequestDetailsComponent },

      { path: 'Employee_Attendance_Logs', component: EmployeeAttendanceLogsComponent },

      // Government Office
      { path: 'Document', component: DocumentListComponent },
      { path: 'Document_Details', component: DocumentDetailsComponent },

      { path: 'Site_Progress_Report', component: GovernmentTransactionMasterComponent },
      { path: 'Site_Progress_Report_Details', component: GovernmentTransactionDetailsComponent },
      { path: 'Respected_child', component: RespectedChildComponentComponent },

      { path: 'Site_Work_Master', component: SiteWorkMasterComponent },
      { path: 'Site_Work_Master_Detail', component: SiteWorkMasterDetailComponent },

      { path: 'Site_Work_Group', component: SiteWorkGroupMasterComponent },
      { path: 'Site_Work_Group_Details', component: SiteWorkGroupMasterDetailsComponent },


      { path: 'Site_Work_Done', component: SiteWorkDoneMasterComponent },
      { path: 'Site_Work_Done_Details', component: SiteWorkDoneMasterDetailsComponent },

      // Razorpay
      { path: 'Razorpay', component: RazorpayComponent },

      // { path: 'Progress_Report', component: ProgressReportComponent },
    ]


  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
