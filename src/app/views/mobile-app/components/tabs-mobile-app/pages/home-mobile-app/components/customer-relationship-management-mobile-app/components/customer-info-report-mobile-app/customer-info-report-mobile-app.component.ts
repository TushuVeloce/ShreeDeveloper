import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-customer-info-report-mobile-app',
  templateUrl: './customer-info-report-mobile-app.component.html',
  styleUrls: ['./customer-info-report-mobile-app.component.scss'],
  standalone: false
})
export class CustomerInfoReportMobileAppComponent implements OnInit {
  Entity: CRMReports = CRMReports.CreateNewInstance();
  MasterList: CRMReports[] = [];
  DisplayMasterList: CRMReports[] = [];
  SiteList: Site[] = [];
  CustomerList: CRMReports[] = [];
  SiteRef: number = 0;
  CustomerRef: number = 0;

  companyRef = 0;

  // headers: string[] = ['#', 'Customer ID', 'Customer Name', 'Address', 'Contact No', 'Pan', 'Aadhar No', 'Lead Source', 'Booking Reamrk', 'Plot No', 'Area in Sqm', 'Area in Sqft', 'Basic per Rate', 'Discount Rate on Area', 'Total Plot Amount', 'Government Value', 'Value of Agreement', 'Reg Tax Value In %', 'Stamp Duties', 'Gst %', 'Gst Total Amount', 'Goods Services Tax', 'Legal Charges', 'Total Cheque Recieved', 'Total Cash Recieved', 'Total Amount Recieved', 'Grand Total', 'Action'];
  headers: string[] = ['#', 'Customer ID', 'Customer Name', 'Address', 'Contact No', 'Pan Card No', 'Aadhar Card No', 'Lead Source', 'Booking Remark', 'Plot No', 'Area in Sqm', 'Area in Sqft', 'Basic per Rate', 'Discount Rate on Area', 'Total Plot Amount', 'Government Value', 'Value of Agreement', 'Reg Tax Value In %', 'Stamp Duties', 'GST Total Amount', 'Goods Services Tax', 'Legal Charges', 'Total Cheque Recieved', 'Total Cash Recieved', 'Total Amount Recieved', 'Grand Total'];


  filters: FilterItem[] = [];
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};


  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    // this.loadCustomerInfoReportIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadCustomerInfoReportIfCompanyExists();
    await this.loadFilters();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadCustomerInfoReportIfCompanyExists();
    // await this.filterCustomerList();
    await this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  loadFilters() {
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['site'] > 0 ? this.selectedFilterValues['site'] : null,
      }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
    // debugger
    console.log('Updated Filters:', updatedFilters);

    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'site':
          this.SiteRef = selectedValue ?? 0;
          break;
      }
    }
    await this.getCustomerReportByCompanyAndSiteRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }
  private async loadCustomerInfoReportIfCompanyExists(): Promise<void> {
    
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.FormulateSiteListByCompanyRef();
  }

  FormulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    this.SiteRef = 0;
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
    });
    this.SiteList = lst;
    // if (this.SiteRef == 0 && lst.length > 0) {
    //   this.SiteRef = lst[0].p.Ref
    //   this.getCustomerReportByCompanyAndSiteRef();
    // }
  }

  getCustomerReportByCompanyAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.haptic.error();
      return;
    }
    if (this.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Site not Selected');
      await this.toastService.present('Site not selected', 1000, 'danger');

      return;
    }
    let lst = await CRMReports.FetchEntireListByCompanyAndSiteRef(this.companyRef, this.SiteRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
    });
    this.DisplayMasterList = lst;
    // if (this.CustomerRef == 0 && lst.length > 0) {
    //   this.CustomerRef = lst[0].p.CustomerEnquiryRef
    // }

  }

  OnCustomerSelection = () => {
    let report = this.CustomerList.filter((data) => data.p.CustomerEnquiryRef == this.CustomerRef);
    if (report.length > 0) {
      this.Entity = report[0];
    }
  }
}
