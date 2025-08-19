import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, OpeningBalanceModeOfPayments, PayerTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-expense',
  standalone: false,
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  Entity: Expense = Expense.CreateNewInstance();
  AllList: Expense[] = [];
  MasterList: Expense[] = [];
  DisplayMasterList: Expense[] = [];
  SiteList: Site[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  SearchString: string = '';
  SelectedExpense: Expense = Expense.CreateNewInstance();
  CustomerRef: number = 0;
  TotalInvoice: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  TotalInvoiceAmount: number = 0
  TotalGivenAmount: number = 0
  RemainingAmountOfGrandTotal: number = 0

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  Cash = OpeningBalanceModeOfPayments.Cash
  RecipientList: Invoice[] = [];
  RecipientTypesList = DomainEnums.RecipientTypesList();

  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  PayerPlotNo: string = '';

  headers: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Recipient Name', 'Reason', 'Bill Amount', 'Given Amount', 'Remaining Amount', 'Shree Balance', 'Mode of Payment', 'Action'];
  printheaders: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Recipient Name', 'Reason', 'Bill Amount', 'Given Amount', 'Remaining Amount', 'Shree Balance', 'Mode of Payment'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private DateconversionService: DateconversionService,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      this.Entity.p.ExpenseModeOfPayment = 0
      this.Entity.p.Ref = 0
      await this.getSiteListByCompanyRef();
      await this.getLedgerListByCompanyRef();
      await this.FetchEntireListByFilters();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    const pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.pageSize = pageSize - 6
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
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(this.companyRef(), this.Entity.p.SiteRef, this.Entity.p.RecipientType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.RecipientList = lst;
  }

  getSiteListByCompanyRef = async () => {
    this.Entity.p.SiteRef = 0
    this.Entity.p.Ref = 0
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getLedgerListByCompanyRef = async () => {
    this.Entity.p.LedgerRef = 0
    this.Entity.p.SubLedgerRef = 0
    this.Entity.p.Ref = 0
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    this.Entity.p.SubLedgerRef = 0
    this.Entity.p.Ref = 0
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubLedgerList = lst;
  }

  ClearRef = () => {
    this.Entity.p.Ref = 0
  }

  FetchEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchEntireListByFilters(
      this.companyRef(),
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.SiteRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.ExpenseModeOfPayment,
      this.Entity.p.Ref,
      this.Entity.p.RecipientRef,
      async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));

    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    if (this.DisplayMasterList.length > 0) {
      this.TotalInvoiceAmount = this.DisplayMasterList[0].p.TotalInvoiceAmount;
      this.TotalGivenAmount = this.DisplayMasterList[0].p.TotalGivenAmount;
      this.RemainingAmountOfGrandTotal = this.DisplayMasterList[0].p.RemainingAmountOfGrandTotal;
    }
    this.loadPaginationData();
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: Expense) => {
    this.SelectedExpense = item.GetEditableVersion();
    Expense.SetCurrentInstance(this.SelectedExpense);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Expense_Details']);
  };

  onDeleteClicked = async (Expense: Expense) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Expense?`,
      async () => {
        await Expense.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Expense ${Expense.p.SubLedgerRef} has been deleted!`
          );
          // await this.getExpenseListByCompanyRef();
          await this.FetchEntireListByFilters();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  printReport(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin?.document.write(`
      <html>
        <head>
          <title>Expense</title>
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

  getTotalInvoice = () => {
    this.TotalInvoice = this.DisplayMasterList.reduce((total: number, item: any) => {
      return total + Number(item.p?.InvoiceAmount || 0);
    }, 0);

    return this.TotalInvoice;
  }

  getTotalGiven = () => {
    return this.DisplayMasterList.reduce((total: number, item: any) => {
      return total + Number(item.p?.GivenAmount || 0);
    }, 0);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddExpense = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Expense_Details']);
  }
}
