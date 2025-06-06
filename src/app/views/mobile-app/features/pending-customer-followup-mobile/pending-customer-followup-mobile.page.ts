import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { FilterService } from 'src/app/services/filter.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-pending-customer-followup-mobile',
  templateUrl: './pending-customer-followup-mobile.page.html',
  styleUrls: ['./pending-customer-followup-mobile.page.scss'],
  standalone:false
})
export class PendingCustomerFollowupMobilePage implements OnInit {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SelectedCustomerEnquiry: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();

  CustomerRef: number = 0;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  date: string = '';
  strCDT: string = '';
  ModalOpen: boolean = false;
  isLoading: boolean = false;
  companyRef: number = 0

  ContactModeList = DomainEnums.ContactModeList();
  selectedFilters: any[] = [];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManagement: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateconversionService: DateconversionService,
    private filterService: FilterService, private dtu: DTU
  ) { }

  async ngOnInit() {
    this.LoadAllData()
  }
  ionViewWillEnter = async () => {
    await this.LoadAllData();
  };
  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.LoadAllData();
    (event.target as HTMLIonRefresherElement).complete();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  private async LoadAllData() {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    if (!this.date) {
      await this.initializeDate();
    }
  }
  private async initializeDate() {
    this.isLoading = true;
    try {
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      const parts = this.strCDT.substring(0, 16).split('-');

      if (parts.length >= 3) {
        this.date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        await this.fetchFollowUps();
      }
    } catch (error) {
      await this.uiUtils.showErrorMessage('Error', 'Failed to initialize date');
    } finally {
      this.isLoading = false;
    }
  }


  async onDateChange(date: string) {
    if (date) {
      const parts = date.split('-');
      if (parts.length >= 3) {
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
    } else {
      this.date = '';
      this.strCDT = '';
    }

    await this.fetchFollowUps();
  }

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  private async fetchFollowUps() {
    this.isLoading = true;
    try {
      // const followUps = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
      //   this.strCDT,
      //   this.InterestedPlotRef,
      //   async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      // );

      // this.followupList = followUps;
      // this.FilterFollowupList = followUps;
      // this.strCDT = this.dtu.ConvertStringDateToFullFormat(this.ReminderDate);
      let FollowUp = await CustomerFollowUp.FetchEntirePendingListByContactModeRef(this.companyRef, this.Entity.p.ContactMode,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
      console.log('FollowUp :', FollowUp, this.companyRef, this.strCDT, this.Entity.p.ContactMode);
      this.followupList = FollowUp
      this.FilterFollowupList = FollowUp;
    } catch (error) {
      await this.uiUtils.showErrorMessage('Error', 'Failed to fetch follow-ups');
    } finally {
      this.isLoading = false;
    }
  }

  async onFollowUpClick(followup: CustomerFollowUp) {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    this.onAddCustomerEnquiry()
    // await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }

  async onAddCustomerEnquiry() {
    await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }
  formatData = (list: any[]) => {
    return list.map(item => ({
      Ref: item.p.Ref,
      Name: item.p.Name
    }));
  };
  openFilterSheet = async () => {
    const filterData = {
      categories: [
        {
          Name: 'Contact Mode',
          Ref: 100,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.ContactModeList
        }
      ]
    };

    // console.log('Vendor List:', this.VendorList);
    // console.log('Stage List:', this.StageList);

    try {
      const res = await this.filterService.openFilter(filterData, this.selectedFilters);
      console.log('res :', res);

      if (res.selected && res.selected.length > 0) {
        this.selectedFilters = res.selected;
        console.log('Selected Filters:', this.selectedFilters);

        for (const filter of this.selectedFilters) {
          console.log('Filter:', filter);

          switch (filter.category.Ref) {
            case 100:
              this.Entity.p.ContactMode = filter.selectedOptions[0].Ref;
              break;
          }
        }

        this.getCustomerFollowUpPendingListByContactModeRef();
      } else {
        this.Entity.p.ContactMode = 0;
        this.selectedFilters = [];
        this.getCustomerFollowUpPendingListByContactModeRef();
      }
    } catch (error) {
      console.error('Error in filter selection:', error);
    }
  };
  getCustomerFollowUpPendingListByContactModeRef = async () => {
    try {
      this.isLoading = true;
      let FollowUp = await CustomerFollowUp.FetchEntirePendingListByContactModeRef(this.companyRef, this.Entity.p.ContactMode,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.FilterFollowupList = FollowUp
      this.followupList = FollowUp;
      console.log('FollowUp :', FollowUp);
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  };
}
