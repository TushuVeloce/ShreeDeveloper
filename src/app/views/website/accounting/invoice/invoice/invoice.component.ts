import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-invoice',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  Entity: Invoice = Invoice.CreateNewInstance();
  MasterList: Invoice[] = [];
  DisplayMasterList: Invoice[] = [];
  SearchString: string = '';
  SiteList: Site[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  TotalInvoice: number = 0;
  SelectedInvoice: Invoice = Invoice.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Date', 'Bill No', 'Site Name', 'Ledger', 'Sub Ledger', 'Description', 'Recipient Name', 'Bill Amount', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService,
  ) {
    effect(async () => {
      await this.getInvoiceListByCompanyRef();
      await this.getSiteListByCompanyRef();
      await this.getLedgerListByCompanyRef();
      // await this.FetchEntireListByFilters();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getSiteListByCompanyRef = async () => {
    this.Entity.p.SiteRef = 0
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
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    this.Entity.p.SubLedgerRef = 0
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
    let lst = await Invoice.FetchEntireListByFilters(this.Entity.p.SiteRef, this.Entity.p.LedgerRef, this.Entity.p.SubLedgerRef, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getInvoiceListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Invoice.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Invoice) => {
    this.SelectedInvoice = item.GetEditableVersion();
    Invoice.SetCurrentInstance(this.SelectedInvoice);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Billing_Details']);
  };

  onDeleteClicked = async (Invoice: Invoice) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Bill?`,
      async () => {
        await Invoice.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Bill ${Invoice.p.RecipientName} has been deleted!`
          );
          await this.getInvoiceListByCompanyRef();
          // await this.FetchEntireListByFilters();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  navigateToPrint = async (item: Invoice) => {
    this.router.navigate(['/homepage/Website/Billing_Print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

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

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddInvoice = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Billing_Details']);
  }
}
