import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-stock-inward',
  standalone: false,
  templateUrl: './stock-inward.component.html',
  styleUrls: ['./stock-inward.component.scss'],
})
export class StockInwardComponent implements OnInit {

  Entity: StockInward = StockInward.CreateNewInstance();
  MasterList: StockInward[] = [];
  DisplayMasterList: StockInward[] = [];
  list: [] = []
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  SearchString: string = '';
  SelectedStockInward: StockInward = StockInward.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  MaterialInwardStatus = MaterialRequisitionStatuses;


  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Chalan No', 'PO ID','Site', 'Vendor', 'Material', 'Unit', 'Ordered Qty', 'Total Inward Qty', 'Remaining Qty', 'Inward Date', 'Action & Print'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService, private dtu: DTU,
  ) {
    effect(async () => {
      await this.getInwardListByCompanySiteAndVendorRef();
      await this.getSiteListByCompanyRef();
      await this.getVendorListByCompanyRef();
    });
  }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
  }

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

  getVendorListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.VendorRef = 0
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
    if (this.VendorList.length > 0) {
      this.Entity.p.VendorRef = 0
    }
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getInwardListByCompanySiteAndVendorRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];

    let lst = await StockInward.FetchEntireListByCompanyRefSiteAndVendorRef(this.companyRef(), this.Entity.p.SiteRef, this.Entity.p.VendorRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  AddStockInward = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    await this.router.navigate(['/homepage/Website/Stock_Inward_Details']);
  }

  // onEditClicked = async (item: StockInward) => {
  //   this.router.navigate(['/homepage/Website/Stock_Inward_Details'], {
  //     state: { inwardref: item.p.Ref }
  //   });
  // };

  onEditClicked = async (item: StockInward) => {
    this.SelectedStockInward = item.GetEditableVersion();
    StockInward.SetCurrentInstance(this.SelectedStockInward);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Stock_Inward_Details']);
  };

  navigateToPrint = async (item: StockInward) => {
    this.router.navigate(['/homepage/Website/Stock_Inward_Print'], {
      state: { inwardref: item.p.Ref }
    });
  }

  onDeleteClicked = async (StockInward: StockInward) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Material Requisition?`,
      async () => {
        await StockInward.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `StockInward ${StockInward.p.SiteName} has been deleted!`
          );
          this.SearchString = '';
          this.loadPaginationData();
          if (this.Entity.p.SiteRef <= 0) {
            this.getInwardListByCompanySiteAndVendorRef();
          } else {
            this.getInwardListByCompanySiteAndVendorRef();
          }
        });
      }
    );
  };


  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

}
