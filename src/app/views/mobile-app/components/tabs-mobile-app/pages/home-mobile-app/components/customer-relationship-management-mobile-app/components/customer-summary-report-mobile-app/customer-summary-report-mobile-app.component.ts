import { Component, OnInit } from '@angular/core';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-customer-summary-report-mobile-app',
  templateUrl: './customer-summary-report-mobile-app.component.html',
  styleUrls: ['./customer-summary-report-mobile-app.component.scss'],
  standalone:false
})
export class CustomerSummaryReportMobileAppComponent  implements OnInit {

  Entity: CRMReports = CRMReports.CreateNewInstance();
  MasterList: CRMReports[] = [];
  DisplayMasterList: CRMReports[] = [];
  SiteList: Site[] = [];
  CustomerList: CRMReports[] = [];
  SiteRef: number = 0;
  CustomerRef: number = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(
    // private uiUtils: UIUtils, 
    private companystatemanagement: CompanyStateManagement,
        private toastService: ToastService,
        private haptic: HapticService,
        private alertService: AlertService,
        private loadingService: LoadingService
  ) {}

  ngOnInit() { }

  async handleRefresh(event: CustomEvent): Promise<void> {
    // await this.loadCustomerInfoReportIfCompanyExists();
    // // await this.filterCustomerList();
    // await this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }
  FormulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    this.SiteRef = 0;
    if (this.companyRef() <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
    });
    this.SiteList = lst;
    if (this.SiteRef == 0 && lst.length > 0) {
      this.SiteRef = lst[0].p.Ref
      this.getCustomerReportByCompanyAndSiteRef();
    }
  }

  getCustomerReportByCompanyAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await CRMReports.FetchEntireListByCompanyAndSiteRef(this.companyRef(), this.SiteRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
    });
    this.CustomerList = lst;
    if (this.CustomerRef == 0 && lst.length > 0) {
      this.CustomerRef = lst[0].p.CustomerEnquiryRef
      this.OnCustomerSelection();
    }

  }

  OnCustomerSelection = () => {
    let report = this.CustomerList.filter((data) => data.p.CustomerEnquiryRef == this.CustomerRef);
    if (report.length > 0) {
      this.Entity = report[0];
    }
  }


}
