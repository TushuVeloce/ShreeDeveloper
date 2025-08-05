import { Component, OnInit } from '@angular/core';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
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
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
  ) { }

  ngOnInit= (): void => {
    // Optional: you can call loadCustomerSummaryReportIfCompanyExists here if needed
  }

  ionViewWillEnter = async () => {
    await this.loadCustomerSummaryReportIfCompanyExists();
  };

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadCustomerSummaryReportIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private loadCustomerSummaryReportIfCompanyExists = async (): Promise<void>=> {
    try {
      this.loadingService.show();
      this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.companyName = this.appStateManagement.localStorage.getItem('companyName') || '';

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      await this.FormulateSiteListByCompanyRef();
    } catch (error) {
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
        await this.toastService.present(errMsg, 1000, 'danger');
      });
      this.SiteList = lst;
      // if (this.SiteRef === 0 && lst.length > 0) {
      //   this.SiteRef = lst[0].p.Ref;
      //   await this.getCustomerReportByCompanyAndSiteRef();
      // }
    } catch (error) {
    }
  }

  getCustomerReportByCompanyAndSiteRef = async () => {
    try {
      this.Entity = CRMReports.CreateNewInstance();
      this.CustomerList = [];
      if (this.companyRef <= 0 || this.SiteRef <= 0) return;
      const lst = await CRMReports.FetchEntireListByCompanyAndSiteRef(this.companyRef, this.SiteRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
      });

      this.CustomerList = lst;
      this.DropdownCustomerList=lst
      this.DropdownCustomerList = lst.filter(item => item.p && item.p.CustID);
      this.CustomerList = lst.filter(item => item.p && item.p.CustID);
    } catch (error) {
    }
  }

  OnCustomerSelection = (ID: number) => {
    let report = this.CustomerList.filter((data) => data.p.CustomerEnquiryRef == ID);
    if (report.length > 0) {
      this.Entity = report[0];
    }
  }


  public selectCustomerIDBottomsheet = async (): Promise<void>=> {
    try {
      let options: any[] = [];
      if (options) {
        options = this.DropdownCustomerList.map(item => ({
          p: {
            Ref: item.p.CustomerEnquiryRef,
            Name: item.p.CustID
          }
        }));
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
  

  public selectSiteBottomsheet = async (): Promise<void>=> {
      try {
        const options = this.SiteList;
        this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
          this.selectedSite = selected;
          this.SiteName = selected[0].p.Name;
          this.SiteRef = selected[0].p.Ref;
          this.Entity.p.Ref = selected[0].p.Ref;
          this.selectedCustomerID=[];
          this.CustomerIDName='';
        });
        if (this.SiteRef){
          await this.getCustomerReportByCompanyAndSiteRef();
        }
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
