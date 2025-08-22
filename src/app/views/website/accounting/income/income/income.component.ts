import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, ModeOfPayments, OpeningBalanceModeOfPayments, PayerTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-income',
  standalone: false,
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  Entity: Income = Income.CreateNewInstance();
  MasterList: Income[] = [];
  AllList: Income[] = [];
  DisplayMasterList: Income[] = [];
  SiteList: Site[] = [];
  Cash = OpeningBalanceModeOfPayments.Cash
  BankList: OpeningBalance[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  Bill = ModeOfPayments.Bill;
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref != this.Bill);
  SearchString: string = '';
  TotalIncome: number = 0;
  SelectedIncome: Income = Income.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  ModeOfPayments = ModeOfPayments

  PayerList: Income[] = [];
  PayerTypesList = DomainEnums.PayerTypesList();
  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  PayerPlotNo: string = '';

  StartDate = '';
  EndDate = '';

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Received By', 'Reason', 'Income Amount', 'Shree Balance', 'Mode of Payment', 'Action'];
  printheaders: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Received By', 'Reason', 'Income Amount', 'Shree Balance', 'Mode of Payment'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private DateconversionService: DateconversionService,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) {
    effect(async () => {
      this.Entity.p.IncomeModeOfPayment = 0
      this.Entity.p.Ref = 0
      await this.getSiteListByCompanyRef();
      await this.getLedgerListByCompanyRef();
      await this.getIncomeListByCompanyRef();
      await this.FetchEntireListByFilters();
      await this.FormulateBankList();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    const pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.pageSize = pageSize - 6
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

  public FormulateBankList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.BankList = lst.filter((item) => item.p.BankAccountRef > 0 && (item.p.OpeningBalanceAmount > 0 || item.p.InitialBalance > 0));
  };


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
      this.FetchEntireListByFilters();
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

  FetchEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    console.log('this.Entity.p.IncomeModeOfPayment :', this.Entity.p.IncomeModeOfPayment);

    this.Entity.p.StartDate = this.dtu.ConvertStringDateToFullFormat(this.StartDate);
    this.Entity.p.EndDate = this.dtu.ConvertStringDateToFullFormat(this.EndDate);

    let lst = await Income.FetchEntireListByFilters(
      this.companyRef(),
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.SiteRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.IncomeModeOfPayment,
      this.Entity.p.BankAccountRef,
      this.Entity.p.PayerRef,
      async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.AllList = lst.filter((item) => item.p.Reason != '');
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  ClearRef = () => {
    this.Entity.p.Ref = 0
  }

  getIncomeListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Income.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.AllList = lst.filter((item) => item.p.Reason != '');
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: Income) => {
    if (item.p.IsIncomeAutoGenerated) {
      await this.uiUtils.showErrorToster('Edit Not allowed income Auto Generated');
      return;
    }
    this.SelectedIncome = item.GetEditableVersion();
    Income.SetCurrentInstance(this.SelectedIncome);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Income_Details']);
  };

  onDeleteClicked = async (Income: Income) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Income?`,
      async () => {
        await Income.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Income ${Income.p.SubLedgerRef} has been deleted!`
          );
          await this.FetchEntireListByFilters();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  filterByReason = () => {
    this.DisplayMasterList = this.MasterList.filter((data) => data.p.Ref == this.Entity.p.Ref)
  }

  getTotalIncome = () => {
    this.TotalIncome = this.DisplayMasterList.reduce((total: number, item: any) => {
      return total + Number(item.p?.IncomeAmount || 0);
    }, 0);

    return this.TotalIncome;
  }

  printIncome(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin?.document.write(`
      <html>
        <head>
          <title>Income</title>
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

  AddIncome = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Income_Details']);
  }
}

