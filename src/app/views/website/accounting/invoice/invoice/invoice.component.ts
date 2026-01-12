import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationFeatures,
  DomainEnums,
} from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { FeatureAccessService } from 'src/app/services/feature-access.service';
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
  AllList: Invoice[] = [];
  MasterList: Invoice[] = [];
  DisplayMasterList: Invoice[] = [];
  SearchString: string = '';
  SiteList: Site[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  TotalInvoice: number = 0;
  RecipientList: Invoice[] = [];
  SelectedInvoice: Invoice = Invoice.CreateNewInstance();
  RecipientTypesList = DomainEnums.RecipientTypesList();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  Reason = '';

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  // headers: string[] = ['Date', 'Bill No', 'Site Name', 'Ledger', 'Sub Ledger', 'Reason', 'Recipient Name', 'Bill Amount'];
  headers: string[] = [];
  featureRef: ApplicationFeatures = ApplicationFeatures.Billing;
  showActionColumn = false;

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    public access: FeatureAccessService
  ) {
    effect(async () => {
      this.Entity.p.Ref = 0;
      await this.getSiteListByCompanyRef();
      await this.getLedgerListByCompanyRef();
      // await this.getInvoiceListByCompanyRef();
      await this.FetchEntireListByFilters();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    this.access.refresh();
    this.showActionColumn =
      this.access.canPrint(this.featureRef) ||
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    this.headers = [
      'Date',
      'Bill No',
      'Site Name',
      'Ledger',
      'Sub Ledger',
      'Reason',
      'Recipient Name',
      'Bill Amount',
      ...(this.showActionColumn ? ['Action'] : []),
    ];
  }

  getSiteListByCompanyRef = async () => {
    this.Entity.p.SiteRef = 0;
    this.Entity.p.Ref = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
  };

  filterByReason = () => {
    this.DisplayMasterList = this.MasterList.filter(
      (data) => data.p.Reason == this.Reason
    );
  };

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
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(
      this.companyRef(),
      this.Entity.p.SiteRef,
      this.Entity.p.RecipientType,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.RecipientList = lst;
  };

  getLedgerListByCompanyRef = async () => {
    this.Entity.p.LedgerRef = 0;
    this.Entity.p.SubLedgerRef = 0;
    this.Entity.p.Ref = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst;
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    this.Entity.p.SubLedgerRef = 0;
    this.Entity.p.Ref = 0;
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(
      ledgerref,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SubLedgerList = lst;
  };

  FetchEntireListByFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.StartDate = this.dtu.ConvertStringDateToFullFormat(
      this.Entity.p.StartDate
    );
    this.Entity.p.EndDate = this.dtu.ConvertStringDateToFullFormat(
      this.Entity.p.EndDate
    );

    let lst = await Invoice.FetchEntireListByFilters(
      this.Entity.p.StartDate,
      this.Entity.p.EndDate,
      this.Entity.p.SiteRef,
      this.Entity.p.LedgerRef,
      this.Entity.p.SubLedgerRef,
      this.Entity.p.RecipientRef,
      this.Entity.p.Ref,
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.AllList = lst.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.p.Reason === item.p.Reason && item.p.Reason != ''
        )
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  ClearRef = () => {
    this.Entity.p.Ref = 0;
  };

  // getInvoiceListByCompanyRef = async () => {
  //   this.MasterList = [];
  //   this.DisplayMasterList = [];
  //   if (this.companyRef() <= 0) {
  //     await this.uiUtils.showErrorToster('Company not Selected');
  //     return;
  //   }
  //   let lst = await Invoice.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.AllList = lst;
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  // }

  onEditClicked = async (item: Invoice) => {
    this.SelectedInvoice = item.GetEditableVersion();
    Invoice.SetCurrentInstance(this.SelectedInvoice);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Billing_Details']);
  };

  onDeleteClicked = async (Invoice: Invoice) => {
    if (Invoice.p.IsInvoiceAutoGenerated) {
      await this.uiUtils.showErrorToster(
        "Bill is Auto Generated Can't be Deleted"
      );
      return;
    }
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Bill?`,
      async () => {
        await Invoice.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Bill ${Invoice.p.RecipientName} has been deleted!`
          );
          // await this.getInvoiceListByCompanyRef();
          await this.FetchEntireListByFilters();
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
      state: { printData: item.GetEditableVersion() },
    });
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  };

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1; // reset to first page after filtering

    this.loadPaginationData();
  }

  getTotalInvoice = () => {
    this.TotalInvoice = this.DisplayMasterList.reduce(
      (total: number, item: any) => {
        return total + Number(item.p?.InvoiceAmount || 0);
      },
      0
    );

    return this.TotalInvoice;
  };

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

  AddInvoice = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Billing_Details']);
  };
}
