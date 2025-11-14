import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { InvoiceSumExpenseSum } from 'src/app/classes/domain/entities/website/Dashboard/invoicesumexpensesum/invoicesumexpensesum';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-BillsPayable',
  standalone: false,
  templateUrl: './bills-payable.component.html',
  styleUrls: ['./bills-payable.component.scss'],
})
export class BillsPayableComponent implements OnInit {
  Entity: InvoiceSumExpenseSum = InvoiceSumExpenseSum.CreateNewInstance();
  AllList: InvoiceSumExpenseSum[] = [];
  MasterList: InvoiceSumExpenseSum[] = [];
  DisplayMasterList: InvoiceSumExpenseSum[] = [];
  SearchString: string = '';
  SiteList: Site[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  TotalInvoiceSumExpenseSum: number = 0;
  RecipientList: InvoiceSumExpenseSum[] = [];
  SelectedInvoiceSumExpenseSum: InvoiceSumExpenseSum = InvoiceSumExpenseSum.CreateNewInstance();
  RecipientTypesList = DomainEnums.RecipientTypesList();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  SelectedBillPayableMonths: number = 0;
  BillPayableFilterType: number = 57

  MonthList = DomainEnums.MonthList(true, '--Select Month--');

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Vendor Name', 'Site Name', 'Bill Amount', 'Given Amount', 'Remaining Amount', 'Total Cash Paid', 'Total Cheque Paid'];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
  ) {
    effect(async () => {
      this.Entity.p.Ref = 0
      await this.getSiteListByCompanyRef();
      await this.getInvoiceSumExpenseSumListByCompanySiteMonthFilterType();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
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

  getInvoiceSumExpenseSumListByCompanySiteMonthFilterType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await InvoiceSumExpenseSum.FetchEntireListByCompanySiteMonthFilterType(this.companyRef(), this.Entity.p.SiteRef, this.SelectedBillPayableMonths, this.BillPayableFilterType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    console.log('this.MasterList :', this.MasterList);
    this.DisplayMasterList = lst;
    this.loadPaginationData();
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  get totalInvoiceAmount(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.InvoiceAmount || 0), 0);
  }

  get totalGivenAmount(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.GivenAmount || 0), 0);
  }

  get totalRemainingAmount(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.RemainingAmount || 0), 0);
  }

  get totalCashReceived(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.TotalCashReceived || 0), 0);
  }

  get totalChequeReceived(): number {
    return this.DisplayMasterList.reduce((sum, item) => sum + (item.p.TotalChequeReceived || 0), 0);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }
}
