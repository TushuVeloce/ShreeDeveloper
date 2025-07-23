import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-customer-summary-report-mobile-app',
  templateUrl: './customer-summary-report-mobile-app.component.html',
  styleUrls: ['./customer-summary-report-mobile-app.component.scss'],
  standalone: false,
})
export class CustomerSummaryReportMobileAppComponent implements OnInit {

  Entity: CRMReports = CRMReports.CreateNewInstance();
  MasterList: CRMReports[] = [];
  DisplayMasterList: CRMReports[] = [];
  SelectedCRMReports: CRMReports = CRMReports.CreateNewInstance();

  SiteList: Site[] = [];
  CustomerList: CRMReports[] = [];
  DropdownCustomerList: CRMReports[] = [];

  SiteRef: number = 0;
  CustomerRef: number = 0;

  ModalOpen: boolean = false;

  companyRef: number = 0;
  companyName: string = '';

  SiteName: string = '';
  selectedSite: any[] = [];

  CustomerIDName: string = '';
  selectedCustomerID: any[] = [];

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};

  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
  ) { }

  ngOnInit(): void {
    // Optional: you can call loadCustomerSummaryReportIfCompanyExists here if needed
  }

  ionViewWillEnter = async () => {
    await this.loadCustomerSummaryReportIfCompanyExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadCustomerSummaryReportIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadCustomerSummaryReportIfCompanyExists(): Promise<void> {
    try {
      this.loadingService.show();

      this.companyRef = Number(await this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.companyName = await this.appStateManagement.localStorage.getItem('companyName') || '';

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.FormulateSiteListByCompanyRef();
    } catch (error) {
      console.error('Error in loadCustomerSummaryReportIfCompanyExists:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  FormulateSiteListByCompanyRef = async () => {
    try {
      this.SiteList = [];
      this.SiteRef = 0;
      this.CustomerList = [];
      this.Entity = CRMReports.CreateNewInstance();

      if (this.companyRef <= 0) return;

      const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        console.error('Error fetching site list:', errMsg);
      });

      this.SiteList = lst;

      if (this.SiteRef === 0 && lst.length > 0) {
        this.SiteRef = lst[0].p.Ref;
        await this.getCustomerReportByCompanyAndSiteRef();
      }
    } catch (error) {
      console.error('Error in FormulateSiteListByCompanyRef:', error);
    }
  }

  getCustomerReportByCompanyAndSiteRef = async () => {
    try {
      this.Entity = CRMReports.CreateNewInstance();
      this.CustomerList = [];

      if (this.companyRef <= 0 || this.SiteRef <= 0) return;

      const lst = await CRMReports.FetchEntireListByCompanyAndSiteRef(this.companyRef, this.SiteRef, async errMsg => {
        console.error('Error fetching customer report:', errMsg);
      });

      this.CustomerList = lst;
      this.DropdownCustomerList=lst
      console.log('this.CustomerList :', this.CustomerList);
    } catch (error) {
      console.error('Error in getCustomerReportByCompanyAndSiteRef:', error);
    }
  }

  OnCustomerSelection = (ID: number) => {
    let report = this.CustomerList.filter((data) => data.p.CustomerEnquiryRef == ID);
    if (report.length > 0) {
      this.Entity = report[0];
    }
  }


  public async selectCustomerIDBottomsheet(): Promise<void> {
    try {
      let options: any[] = [];
      if (options) {
        options = this.DropdownCustomerList.map(item => ({
          p: {
            Ref: item.p.CustomerEnquiryRef,
            Name: item.p.CustID
          }
        }));
        // options = this.CustomerList
      }

      this.openSelectModal(options, this.selectedCustomerID, false, 'Select Customer ID', 1, (selected) => {
        this.selectedCustomerID = selected;
        this.CustomerIDName = selected[0].p.Name;
        this.CustomerRef = selected[0].p.Ref;
        this.OnCustomerSelection(selected[0].p.Ref);
      });
    } catch (error) {

    }
  }
  

  public async selectSiteBottomsheet(): Promise<void> {
      try {
  
        const options = this.SiteList;
  
        this.openSelectModal(options, this.selectedSite, false, 'Select Customer Status', 1, (selected) => {
          this.selectedSite = selected;
          this.SiteName = selected[0].p.Name;
          this.SiteRef = selected[0].p.Ref;
          this.Entity.p.Ref = selected[0].p.Ref;
          this.getCustomerReportByCompanyAndSiteRef();
        });
      } catch (error) {
  
      }
    }

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }

}
