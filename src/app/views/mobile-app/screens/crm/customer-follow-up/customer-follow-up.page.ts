import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customer-follow-up',
  templateUrl: './customer-follow-up.page.html',
  styleUrls: ['./customer-follow-up.page.scss'],
  standalone: false
})
export class CustomerFollowUpPage implements OnInit {
  Entity: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: any[] = [];
  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();

  CustomerRef: number = 0;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  date: string = '';
  strCDT: string = '';
  ModalOpen: boolean = false;
  isLoading: boolean = false;
  companyRef : number = 0
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManagement: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateconversionService: DateconversionService
  ) {}

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
      await this.loadSitesByCompanyRef();
    }
   this.FilterFollowupList = [
      {
        p: {
          CustomerName: 'Rahul Sharma',
          ContactNos: '9876543210',
          ReminderDate: '2025-05-10T10:00:00Z',
          CustomerStatusName: 'Interested',
          CustomerRequirement: '3 BHK Apartment in Pune',
        }
      },
      {
        p: {
          CustomerName: 'Priya Desai',
          ContactNos: '9988776655',
          ReminderDate: '2025-05-11T14:30:00Z',
          CustomerStatusName: 'Follow-up Later',
          CustomerRequirement: 'Commercial Office Space',
        }
      },
      {
        p: {
          CustomerName: 'Amit Joshi',
          ContactNos: '9123456789',
          ReminderDate: '2025-05-12T09:00:00Z',
          CustomerStatusName: 'Converted',
          CustomerRequirement: '1 BHK Flat near Station',
        }
      }
    ];

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
      const followUps = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
        this.strCDT,
        this.InterestedPlotRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.followupList = followUps;
      this.FilterFollowupList = followUps;
    } catch (error) {
      await this.uiUtils.showErrorMessage('Error', 'Failed to fetch follow-ups');
    } finally {
      this.isLoading = false;
    }
  }

  private async loadSitesByCompanyRef() {
    this.isLoading = true;
    try {
      this.followupList = [];
      this.FilterFollowupList = [];
      this.SiteList = [];

      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      const sites = await Site.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.SiteList = sites;
    } catch (error) {
      await this.uiUtils.showErrorMessage('Error', 'Failed to load sites');
    } finally {
      this.isLoading = false;
    }
  }

  async loadPlotsBySiteRef(siteRef: number) {
    this.isLoading = true;
    try {
      if (siteRef <= 0) {
        await this.uiUtils.showWarningToster(`Please select a site`);
        return;
      }

      this.InterestedPlotRef = 0;

      const plots = await Plot.FetchEntireListBySiteandbookingremarkRef(
        siteRef,
        BookingRemark.Booked,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.PlotList = plots;
    } catch (error) {
      await this.uiUtils.showErrorMessage('Error','Failed to load plots');
    } finally {
      this.isLoading = false;
    }
  }


  async onFollowUpClick(followup: CustomerFollowUp) {
    this.SelectedFollowUp = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }

  async onAddCustomerEnquiry() {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
  }
}
