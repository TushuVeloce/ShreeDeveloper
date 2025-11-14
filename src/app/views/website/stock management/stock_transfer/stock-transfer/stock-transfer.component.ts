import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockTransfer } from 'src/app/classes/domain/entities/website/stock_management/stock-transfer/stocktransfer';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss'],
  standalone: false,
})
export class StockTransferComponent implements OnInit {
  Entity: StockTransfer = StockTransfer.CreateNewInstance();
  MasterList: StockTransfer[] = [];
  DisplayMasterList: StockTransfer[] = [];
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedStockTransfer: StockTransfer = StockTransfer.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Date', 'From Site', 'To Site', 'Material Name', 'Unit', 'Current Qty.', 'Transferred Qty.', 'Remaining Qty.', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService,
  ) {
    effect(async () => {
      this.getSiteListByCompanyRef()
      await this.getStockTransferListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.FromSiteRef = 0
    this.Entity.p.ToSiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    if (this.SiteList.length > 0) {
      this.Entity.p.FromSiteRef = 0
      this.Entity.p.ToSiteRef = 0
    }
    // this.getInwardListByAllFilters()
  }

  getStockTransferListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockTransfer.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getTransferListByCompanyRefAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.FromSiteRef <= 0 && this.Entity.p.ToSiteRef == 0) {
      this.getStockTransferListByCompanyRef();
      return;
    }
    let lst = await StockTransfer.FetchEntireListByCompanyRefAndSiteRef(this.companyRef(), this.Entity.p.FromSiteRef, this.Entity.p.ToSiteRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: StockTransfer) => {
    this.SelectedStockTransfer = item.GetEditableVersion();
    StockTransfer.SetCurrentInstance(this.SelectedStockTransfer);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Stock_Transfer_Details']);
  };

  onDeleteClicked = async (StockTransfer: StockTransfer) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Stock Transfer?`,
      async () => {
        await StockTransfer.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Stock Transfer ${StockTransfer.p.MaterialName} has been deleted!`
          );
          await this.getStockTransferListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
          if (this.Entity.p.FromSiteRef <= 0) {
            this.getStockTransferListByCompanyRef();
          } else {
            this.getTransferListByCompanyRefAndSiteRef();
          }
        });
      }
    );
  };

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

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddStockTransfer = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Stock_Transfer_Details']);
  }
}

