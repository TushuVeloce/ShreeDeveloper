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
  standalone:false
})
export class CustomerSummaryReportMobileAppComponent  implements OnInit {

  Entity: CRMReports = CRMReports.CreateNewInstance();
   MasterList: CRMReports[] = [];
   DisplayMasterList: CRMReports[] = [];
   SelectedCRMReports: CRMReports = CRMReports.CreateNewInstance();
   SiteList: Site[] = [];
   CustomerList: CRMReports[] = [];
   SiteRef: number = 0;
   CustomerRef: number = 0;
   ModalOpen: boolean = false;
  companyRef :number = 0;
  companyName :string = '';

  SiteName: string = '';
  selectedSite: any[] = [];

  CustomerIDName: string = '';
  selectedCustomerID: any[] = [];
 
  //  headers: string[] = ['Sr.No.', 'Customer ID', 'Customer Name', 'Address', 'Contact No', 'Pan', 'Aadhar No', 'Lead Source', 'Agent/Broker', 'Booking Remark', 'Plot No', 'Area in Sqm', 'Area in Sqft', 'Basic per Rate', 'Discount Rate on Area', 'Discount On Plot Amount', 'Total Plot Amount', 'Government Rate sqm', 'Government Value', 'Value of Agreement', 'Reg Tax Value In %', 'Tax Value In Percentage', 'Stamp Duties', 'Goods Services Tax', 'Legal Charges', 'Total Extra Charges', 'Total Cheque Recieved', 'Total Cash Recieved', 'Total Amount Recieved', 'Total Cheque Balance', 'Total Cash Balance', 'Total Balance', 'Grand Total'];
 
 
   filters: FilterItem[] = [];
   // Store current selected values here to preserve selections on filter reload
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
     // this.loadCustomerSummaryReportIfCompanyExists();
   }
 
   ionViewWillEnter = async () => {
     await this.loadCustomerSummaryReportIfCompanyExists();
    //  await this.loadFilters();
   };
 
   async handleRefresh(event: CustomEvent): Promise<void> {
     await this.loadCustomerSummaryReportIfCompanyExists();
     // await this.filterCustomerList();
    //  await this.loadFilters();
     (event.target as HTMLIonRefresherElement).complete();
   }
 
  //  loadFilters() {
  //    this.filters = [
  //      {
  //        key: 'site',
  //        label: 'Site',
  //        multi: false,
  //        options: this.SiteList.map(item => ({
  //          Ref: item.p.Ref,
  //          Name: item.p.Name,
  //        })),
  //        selected: this.selectedFilterValues['site'] > 0 ? this.selectedFilterValues['site'] : null,
  //      }
  //    ];
  //  }
 
  //  async onFiltersChanged(updatedFilters: any[]) {
  //    console.log('Updated Filters:', updatedFilters);
 
  //    for (const filter of updatedFilters) {
  //      const selected = filter.selected;
  //      const selectedValue = (selected === null || selected === undefined) ? null : selected;
 
  //      // Save selected value to preserve after reload
  //      this.selectedFilterValues[filter.key] = selectedValue ?? null;
 
  //      switch (filter.key) {
  //        case 'site':
  //          this.SiteRef = selectedValue ?? 0;
  //          break;
  //      }
  //    }
  //    await this.getCustomerReportByCompanyAndSiteRef();
  //    this.loadFilters(); // Reload filters with updated options & preserve selections
  //  }
   private async loadCustomerSummaryReportIfCompanyExists(): Promise<void> {
    try{
      this.loadingService.show();
      this.companyRef = await Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.companyName = await this.appStateManagement.localStorage.getItem('companyName') || '';

      if (this.companyRef <= 0) {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      await this.FormulateSiteListByCompanyRef();
      await this.getCustomerReportByCompanyRef()
    }catch(error){

    }finally{
      this.loadingService.hide();
    }
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
   }
   getCustomerReportByCompanyRef = async () => {
     this.MasterList = [];
     this.DisplayMasterList = [];
     if (this.companyRef <= 0) {
          await this.toastService.present('Site not selected', 1000, 'danger');
       return;
     }
 
     let lst = await CRMReports.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
       await this.toastService.present('Error' + errMsg, 1000, 'danger');
     });
     this.DisplayMasterList = lst;
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
   }
 
   OnCustomerSelection = () => {
     let report = this.CustomerList.filter((data) => data.p.CustomerEnquiryRef == this.CustomerRef);
     if (report.length > 0) {
       this.Entity = report[0];
     }
   }

  public async selectCustomerIDBottomsheet(): Promise<void> {
    try {
      const options = this.CustomerList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Customer ID', 1, (selected) => {
        this.selectedCustomerID = selected;
        this.Entity.p.CustomerEnquiryRef = selected[0].p.CustomerEnquiryRef;
        this.CustomerIDName = selected[0].p.CustID;
        this.CustomerRef = selected[0].p.CustomerEnquiryRef;
        this.OnCustomerSelection();
      });
    } catch (error) {

    }
  }
  public async selectSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;
        this.Entity.p.Ref = selected[0].p.Ref;
        this.SiteName = selected[0].p.Name;
        this.SiteRef = selected[0].p.Ref;
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
