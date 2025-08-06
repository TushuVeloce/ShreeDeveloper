import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { SharedFilterComponent } from "src/app/views/website/Helpers/shared-filter/shared-filter.component";
import { NzSelectComponent } from "ng-zorro-antd/select";
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';

@Component({
  selector: 'app-payment-history-report',
  standalone: false,
  templateUrl: './payment-history-report.component.html',
  styleUrls: ['./payment-history-report.component.scss'],
})
export class PaymentHistoryReportComponent  implements OnInit {
 Entity: Income = Income.CreateNewInstance();
  MasterList: Income[] = [];
  DisplayMasterList: Income[] = [];
  list: [] = []
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  SearchString: string = '';
  SelectedIncome: Income = Income.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  headers: string[] = ['Sr.No.', 'Date','Site Name', 'Payer Name', 'Amount', 'Mode of Payment', 'Reason'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService, private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService, private dtu: DTU,
  ) {
    effect(async () => {
      await this.getSiteListByCompanyRef();
      await this.getPaymentHistoryListByCompanyRef();
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
    //   this.getCustomerVisitListBySiteRef()
    // }
  }

   getPlotListBySiteRef = async (siteref: number) => {
      this.Entity.p.PlotRef = 0
      this.PlotList = [];
      let lst = await Plot.FetchEntireListBySiteRef(siteref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.PlotList = lst;
    }

   // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }
  getPaymentHistoryListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Income.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  getPaymentHistoryListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
     if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if(this.Entity.p.SiteRef == null){
      this.Entity.p.SiteRef = 0
      this.Entity.p.PlotRef = 0
    }else if(this.Entity.p.PlotRef == null){
      this.Entity.p.PlotRef = 0
    }
    console.log('this.Entity.p.SiteRef, this.Entity.p.PlotRef :', this.Entity.p.SiteRef, this.Entity.p.PlotRef);
    let lst = await Income.FetchEntireListBySiteRef(this.Entity.p.SiteRef, this.Entity.p.PlotRef,this.companyRef(),
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

