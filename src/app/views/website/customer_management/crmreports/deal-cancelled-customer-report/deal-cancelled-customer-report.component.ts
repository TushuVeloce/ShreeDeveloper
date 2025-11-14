import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DealCancelledCustomer } from 'src/app/classes/domain/entities/website/customer_management/dealcancelledcustomer/dealcancelledcustomer';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-deal-cancelled-customer-report',
  standalone: false,
  templateUrl: './deal-cancelled-customer-report.component.html',
  styleUrls: ['./deal-cancelled-customer-report.component.scss'],
})
export class DealCancelledCustomerReportComponent implements OnInit {
  Entity: DealCancelledCustomer = DealCancelledCustomer.CreateNewInstance();
  MasterList: DealCancelledCustomer[] = [];
  DisplayMasterList: DealCancelledCustomer[] = [];
  list: [] = []
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedDealCancelledCustomer: DealCancelledCustomer = DealCancelledCustomer.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Site Name', 'Plot No', 'Customer Name', 'Address', 'City', 'Contact No', 'Reason '];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService, private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService, private dtu: DTU,
  ) {
    effect(async () => {
      await this.getSiteListByCompanyRef();
      await this.getDealCancelledCustomerListBySiteRef();
    });
  }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    const pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.pageSize = pageSize
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.SiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    // if (this.SiteList.length > 0) {
    //   this.Entity.p.SiteRef = this.SiteList[0].p.Ref
    //   this.getDealCancelledCustomerListBySiteRef()
    // }
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getDealCancelledCustomerListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await DealCancelledCustomer.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  getDealCancelledCustomerListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];

    let lst = await DealCancelledCustomer.FetchEntireListBySiteRef(this.Entity.p.SiteRef, this.companyRef(),
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
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  printReport(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
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

