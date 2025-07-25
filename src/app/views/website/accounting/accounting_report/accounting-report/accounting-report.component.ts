import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountingReports, DomainEnums, OpeningBalanceModeOfPayments, PayerTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { AccountingReport } from 'src/app/classes/domain/entities/website/accounting/accountingreport/accoiuntingreport';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-accounting-report',
  standalone: false,
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss'],
})
export class AccountingReportComponent implements OnInit {
  Entity: AccountingReport = AccountingReport.CreateNewInstance();
  MasterList: AccountingReport[] = [];
  DisplayMasterList: AccountingReport[] = [];
  OpeningBalanceList: OpeningBalance[] = [];
  AccountingReportList = DomainEnums.AccountingReportList();
  AccountingReport = AccountingReports;
  SiteList: Site[] = [];
  BankRef: number = 0;
  NetBalance: number = 0;
  SearchString: string = '';
  SelectedAccountingReport: AccountingReport = AccountingReport.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 6; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  Cash = OpeningBalanceModeOfPayments.Cash
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  RecipientList: Invoice[] = [];
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  RecipientTypesList = DomainEnums.RecipientTypesList();

  PayerList: Income[] = [];
  PayerTypesList = DomainEnums.PayerTypesList();
  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  PayerPlotNo: string = '';



  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Date', 'Payer Name', 'Recipient Name', 'Site Name', 'Reason', 'Income', 'Expense', 'Shree Bal.', 'Mode of Payment', 'Narration',];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService,
  ) {
    effect(async () => {
      this.Entity.p.AccountingReport = AccountingReports.CurrentFinancialYear
      this.Entity.p.StartDate = ''
      this.Entity.p.EndDate = ''
      await this.getOpeningBalanceListByCompanyRef();
      await this.getCurrentBalanceByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.getEntireListByFilters();
      await this.getLedgerListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    const pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.pageSize = pageSize - 6
  }

  // getAccountingReportListByCompanyRef = async () => {
  //   this.MasterList = [];
  //   this.DisplayMasterList = [];
  //   if (this.companyRef() <= 0) {
  //     await this.uiUtils.showErrorToster('Company not Selected');
  //     return;
  //   }
  //   let lst = await AccountingReport.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  // }

  getSiteListByCompanyRef = async () => {
    this.Entity.p.SiteRef = 0
    this.Entity.p.SiteName = ''
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.SubLedgerRef = 0
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubLedgerList = lst;
    console.log('this.SubLedgerList :', this.SubLedgerList);
  }

  onPayerChange = () => {
    let SingleRecord;
    try {
      if (this.Entity.p.PayerType == this.DealDoneCustomer) {
        SingleRecord = this.PayerList.find((data) => data.p.PlotName == this.PayerPlotNo);
      } else {
        SingleRecord = this.PayerList.find((data) => data.p.Ref == this.Entity.p.PayerRef);
      }
      if (SingleRecord?.p) {
        this.Entity.p.IsRegisterCustomerRef = SingleRecord.p.IsRegisterCustomerRef;
        this.Entity.p.PayerRef = SingleRecord.p.Ref;
        if (this.Entity.p.PayerType == this.DealDoneCustomer) {
          this.Entity.p.PlotName = SingleRecord.p.PlotName;
        }
      }
      this.getEntireListByFilters();
    } catch (error) {
    }
  }

  getPayerListBySiteAndPayerType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.PayerType <= 0) {
      return;
    }
    let lst = await Income.FetchPayerNameByPayerTypeRef(this.Entity.p.SiteRef, this.companyRef(), this.Entity.p.PayerType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.PayerList = lst;
  }

  getEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await AccountingReport.FetchEntireListByFilters(
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.AccountingReport,
      this.Entity.p.SiteRef,
      this.Entity.p.ModeOfPayment,
      this.companyRef(),
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.RecipientRef,
      this.Entity.p.PayerRef,
      async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getOpeningBalanceListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.OpeningBalanceList = lst;
    if (this.OpeningBalanceList.length > 0) {
      this.BankRef = this.OpeningBalanceList[0].p.Ref;
      this.getBalanceByBank();
    }
  }

  getRecipientListByRecipientTypeRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      await this.uiUtils.showErrorToster('To Whom not Selected');
      return;
    }

    this.RecipientList = [];
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(this.companyRef(), this.Entity.p.RecipientType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.RecipientList = lst;
  }

  getBalanceByBank = () => {
    let SingleRecord = this.OpeningBalanceList.find((data) => data.p.Ref == this.BankRef);
    if (SingleRecord) {
      this.NetBalance = SingleRecord?.p.NetBalance;
    }
  }

  get totalTotalIncome(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.IncomeAmount || 0), 0);
  }

  get totalTotalExpense(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.GivenAmount || 0), 0);
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
    }
  }

  printReport(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin?.document.write(`
      <html>
        <head>
          <title>Office Report</title>
         <style>
         * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: sans-serif;
           }
            table {
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              border: 1px solid  rgb(169, 167, 167);
              text-align: center;
              padding: 15px;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
        </body>
      </html>
    `);
      popupWin?.document.close();
    }
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

}
