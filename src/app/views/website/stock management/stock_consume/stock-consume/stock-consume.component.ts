import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-stock-consume',
  templateUrl: './stock-consume.component.html',
  styleUrls: ['./stock-consume.component.scss'],
  standalone: false,
})
export class StockConsumeComponent implements OnInit {
  Entity: StockConsume = StockConsume.CreateNewInstance();
  MasterList: StockConsume[] = [];
  DisplayMasterList: StockConsume[] = [];
  SiteList: Site[] = [];
  StageList: Stage[] = [];
  SearchString: string = '';
  SelectedStockConsume: StockConsume = StockConsume.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 4; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site Name', 'Consumption Date', 'Material Name', 'Unit', 'Current Qty.', 'Consumption Qty.', 'Remaining Qty.', 'Stage Name', 'Description', 'Remark', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService,
  ) {
    effect(async () => {
      this.getSiteListByCompanyRef();
      await this.getConsumeListByCompanySiteAndVendorRef();
      await this.getStageListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
  }

  getStageListByCompanyRef = async () => {
    this.StageList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.StageList = lst;
  };

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.SiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    if (this.SiteList.length > 0) {
      this.Entity.p.SiteRef = 0
    }
  }

  getConsumeListByCompanySiteAndVendorRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockConsume.FetchEntireListByCompanySiteAndVendorRef(this.companyRef(), this.Entity.p.SiteRef, this.Entity.p.StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: StockConsume) => {
    this.SelectedStockConsume = item.GetEditableVersion();
    StockConsume.SetCurrentInstance(this.SelectedStockConsume);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Stock_Consume_Details']);
  };

  onDeleteClicked = async (StockConsume: StockConsume) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Stock Consume?`,
      async () => {
        await StockConsume.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Stock Consume ${StockConsume.p.SiteName} has been deleted!`
          );
          await this.getConsumeListByCompanySiteAndVendorRef();
          this.SearchString = '';
          this.loadPaginationData();
          this.getConsumeListByCompanySiteAndVendorRef();
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

  AddStockConsume = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Stock_Consume_Details']);
  }
}
