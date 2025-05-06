import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { BookingRemark } from 'src/app/classes/domain/domainenums/domainenums';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { UIUtils } from 'src/app/services/uiutils.service';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.page.html',
  styleUrls: ['./crm.page.scss'],
  standalone: false,
})
export class CRMPage implements OnInit {
  crmStats = [
    { title: 'Total Visited Customers', value: 123, icon: 'people-outline' },
    { title: 'Total Deals Open', value: 15, icon: 'folder-open-outline' },
    { title: 'Total Deals Closed', value: 50, icon: 'checkmark-circle-outline' },
    { title: 'Total Deals Done', value: 30, icon: 'trophy-outline' }
  ];

  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  

  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();

  InterestedPlotRef: number = 0;
  date: string = '';
  strCDT: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateconversionService: DateconversionService
  ) { }

  async ngOnInit() {
    await this.initializeDate();
    // this.FilterFollowupList = [
    //   {
    //     p: {
    //       CustomerName: 'John Doe',
    //       ContactNos: '9876543210'
    //     }
    //   },
    //   {
    //     p: {
    //       CustomerName: 'Jane Smith',
    //       ContactNos: '9123456789'
    //     }
    //   },
    //   {
    //     p: {
    //       CustomerName: 'Alice Johnson',
    //       ContactNos: '9988776655'
    //     }
    //   },
    //   {
    //     p: {
    //       CustomerName: 'Robert Brown',
    //       ContactNos: '9112233445'
    //     }
    //   }
    // ];

  }

  async ionViewWillEnter() {
    await this.initializeDate(); // Ensures data refresh every time user re-enters
    await this.loadSitesByCompanyRef(); // Refresh site list
  }
  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadSitesByCompanyRef();
    await this.initializeDate();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async initializeDate() {
    try {
      this.isLoading = true;
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      const parts = this.strCDT.substring(0, 16).split('-');
      if (parts.length >= 3) {
        this.date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        await this.fetchFollowUps();
      }
    } catch (error) {
      await this.uiUtils.showErrorToster('Error loading date and follow-ups');
    } finally {
      this.isLoading = false;
    }
  }

  async onDateChange(date: string) {
    try {
      this.isLoading = true;
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
    } catch (error) {
      await this.uiUtils.showErrorToster('Failed to change date');
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  private async fetchFollowUps() {
    try {
      this.isLoading = true;
      const followUps = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
        this.strCDT,
        this.InterestedPlotRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.followupList = this.FilterFollowupList = followUps;
      console.log('Follow-up list:', followUps);
    } catch (error) {
      await this.uiUtils.showErrorToster('Error fetching follow-ups');
    } finally {
      this.isLoading = false;
    }
  }

  private async loadSitesByCompanyRef() {
    try {
      this.isLoading = true;
      this.SiteList = [];
      this.PlotList = [];

      const companyRef = await this.companystatemanagement.SelectedCompanyRef();
      if (companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      this.SiteList = await Site.FetchEntireListByCompanyRef(
        companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
    } catch (error) {
      await this.uiUtils.showErrorToster('Error loading sites');
    } finally {
      this.isLoading = false;
    }
  }

  async loadPlotsBySiteRef(siteRef: number) {
    try {
      this.isLoading = true;
      if (siteRef <= 0) {
        await this.uiUtils.showWarningToster('Please select a site');
        return;
      }

      this.InterestedPlotRef = 0;

      this.PlotList = await Plot.FetchEntireListBySiteandbookingremarkRef(
        siteRef,
        BookingRemark.Booked,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
    } catch (error) {
      await this.uiUtils.showErrorToster('Error loading plots');
    } finally {
      this.isLoading = false;
    }
  }

  async onFollowUpClick(followup: CustomerFollowUp) {
    try {
      this.SelectedFollowUp = followup.GetEditableVersion();
      CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
      // this.appStateManage.StorageKey.setItem('Editable', 'Edit');
      await this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up/add']);
    } catch (error) {
      await this.uiUtils.showErrorToster('Error navigating to follow-up');
    }
  }

  goToVisitedCustomer() {
    this.router.navigate(['/app_homepage/tabs/crm/customer-enquiry']);
  }

  goToCustomerFollowUp() {
    this.router.navigate(['/app_homepage/tabs/crm/customer-follow-up']);
  }
}
