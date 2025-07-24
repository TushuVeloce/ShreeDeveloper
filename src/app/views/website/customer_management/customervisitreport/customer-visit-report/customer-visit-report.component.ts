import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerSiteVisit } from 'src/app/classes/domain/entities/website/customer_management/customersitevisit/customersitevisit';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customer-visit-report',
  standalone:false,
  templateUrl: './customer-visit-report.component.html',
  styleUrls: ['./customer-visit-report.component.scss'],
})
export class CustomerVisitReportComponent  implements OnInit {

  Entity: CustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  MasterList: CustomerSiteVisit[] = [];
  DisplayMasterList: CustomerSiteVisit[] = [];
  list: [] = []
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedCustomerSiteVisit: CustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Chalan No', 'Site', 'Vendor', 'Material', 'Unit', 'Ordered Qty', 'Total Inward Qty', 'Remaining Qty', 'Inward Date', 'Action & Print'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService, private dtu: DTU,
  ) {
    effect(async () => {
      await this.getInwardListBySiteRef();
      await this.getSiteListByCompanyRef();
    });
  }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled();
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
      this.Entity.p.SiteRef = this.SiteList[0].p.Ref
      this.getInwardListBySiteRef()
    }
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getInwardListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];

    let lst = await CustomerSiteVisit.FetchEntireListBySiteRef(this.Entity.p.SiteRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  navigateToPrint = async (item: CustomerSiteVisit) => {
    this.router.navigate(['/homepage/Website/Stock_Inward_Print'], {
      state: { inwardref: item.p.Ref }
    });
  }

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
