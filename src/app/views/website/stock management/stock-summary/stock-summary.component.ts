import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockSummary } from 'src/app/classes/domain/entities/website/stock_management/stock-summary/stoctsummary';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-stock-summary',
  standalone: false,
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.scss'],
})
export class StockSummaryComponent implements OnInit {

  Entity: StockSummary = StockSummary.CreateNewInstance();
  MasterList: StockSummary[] = [];
  DisplayMasterList: StockSummary[] = [];
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedStockSummary: StockSummary = StockSummary.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  // headers: string[] = ['Sr.No.', 'Site Name', 'Material', 'Ordered Qty', 'Extra Ordered Qty', 'Total Ordered Qty', 'Total Inward Qty ', 'Total Requisition Qty', 'Total Consumed Qty ', 'Transferred Qty ', 'Current Stock ', 'Inward Remaining Qty', 'Ordered Remaining Qty'];
  headers: string[] = ['Sr.No.', 'Site Name', 'Material', 'Ordered Qty', 'Extra Ordered Qty', 'Total Inward Qty ', 'Inward Remaining Qty', 'Total Requisition Qty','Total Consumed Qty ', 'Transferred Qty ', 'Current Stock ','Ordered Remaining Qty'];


  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private DateconversionService: DateconversionService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getStockSummaryListByCompanyRef(); await this.getSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
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

  getStockSummaryListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockSummary.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

   getStockSummaryListByCompanyRefAndSiteRef = async () => {
      this.MasterList = [];
      this.DisplayMasterList = [];
      if (this.Entity.p.SiteRef <= 0) {
        this.getStockSummaryListByCompanyRef();
        return;
      }
      let lst = await StockSummary.FetchEntireListByCompanyRefAndSiteRef(this.companyRef(), this.Entity.p.SiteRef,
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
}

