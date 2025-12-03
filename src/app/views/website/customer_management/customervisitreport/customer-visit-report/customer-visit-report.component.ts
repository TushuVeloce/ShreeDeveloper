import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerSiteVisit } from 'src/app/classes/domain/entities/website/customer_management/customersitevisit/customersitevisit';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { FeatureAccessService } from 'src/app/services/feature-access.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customer-visit-report',
  standalone: false,
  templateUrl: './customer-visit-report.component.html',
  styleUrls: ['./customer-visit-report.component.scss'],
})
export class CustomerVisitReportComponent implements OnInit {
  Entity: CustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  MasterList: CustomerSiteVisit[] = [];
  DisplayMasterList: CustomerSiteVisit[] = [];
  list: [] = [];
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedCustomerSiteVisit: CustomerSiteVisit =
    CustomerSiteVisit.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  featureRef: ApplicationFeatures = ApplicationFeatures.CustomerVisitReport;

  headers: string[] = [
    'Site Name',
    'Plot No',
    'Customer Name',
    'Address',
    'Contact No',
    'Customer Requirement ',
  ];

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
      await this.getSiteListByCompanyRef();
      await this.getCustomerVisitListBySiteRef();
    });
  }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    const pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.pageSize = pageSize;
    this.access.refresh();
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.SiteRef = 0;
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

  getCustomerVisitListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await CustomerSiteVisit.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  getCustomerVisitListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    // if (this.Entity.p.SiteRef <= 0) {
    //   this.getCustomerVisitListByCompanyRef();
    //   return;
    // }
    let lst = await CustomerSiteVisit.FetchEntireListBySiteRef(
      this.Entity.p.SiteRef,
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1; // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  printReport(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );
      popupWin?.document.write(`
      <html>
        <head>
          <title>Office Report</title>
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
}
