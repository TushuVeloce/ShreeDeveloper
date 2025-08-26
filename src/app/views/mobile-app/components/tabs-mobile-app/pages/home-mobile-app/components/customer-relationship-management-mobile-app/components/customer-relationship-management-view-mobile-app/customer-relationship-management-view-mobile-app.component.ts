import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemark } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-customer-relationship-management-view-mobile-app',
  templateUrl: './customer-relationship-management-view-mobile-app.component.html',
  styleUrls: ['./customer-relationship-management-view-mobile-app.component.scss'],
  standalone: false
})
export class CustomerRelationshipManagementViewMobileAppComponent implements OnInit {


  crmStats = [
    { title: 'Total Visited Customers', value: 123, icon: 'people-outline' },
    { title: 'Total Deals Open', value: 15, icon: 'folder-open-outline' },
    { title: 'Total Deals Closed', value: 50, icon: 'checkmark-circle-outline' },
    { title: 'Total Deals Done', value: 30, icon: 'trophy-outline' }
  ];
  gridItems = [
    {
      icon: 'assets/icons/customer_enquiry_mobile_app.png',
      label: 'Customer Enquiry',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry'
    },
    {
      icon: 'assets/icons/customer_followup_mobile_app.png',
      label: 'Followup',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup'
    },
    {
      icon: 'assets/icons/pending_follow_up_mobile_app.png',
      label: 'Pending Followup',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/pending-customer-followup'
    },
    {
      icon: 'assets/icons/customer_info_report_mobile_app.png',
      label: 'customer Info Report',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/customer-info-report'
    },
    {
      icon: 'assets/icons/customer_summary_report_mobile_app.png',
      label: 'Customer Summary Report',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/customer-summary-report'
    },
    {
      icon: 'assets/icons/customer_visit_report_mobile_app.png',
      label: 'Customer Visit Report',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/customer-visit-report'
    },
    {
      icon: 'assets/icons/Payment_History_Report_md.png',
      label: 'Payment History Report',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/payment-history-report'
    },
    {
      icon: 'assets/icons/Deal_Cancelled_Customer_Report_md.png',
      label: 'Deal Cancelled Customer Report',
      routerPath: '/mobile-app/tabs/dashboard/customer-relationship-management/deal-cancelled-customer-report'
    }
  ];

  selectedIndex = 0;

  selectItem(index: number) {
    this.selectedIndex = index;
  }

  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  followupList: CustomerFollowUp[] = [];
  FilterFollowupList: CustomerFollowUp[] = [];
  companyRef: number = 0;


  SelectedFollowUp: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();

  InterestedPlotRef: number = 0;
  date: string = '';
  strCDT: string = '';
  pieData = [
    {
      "name": "Groceries",
      "value": 10
    },
    {
      "name": "Others",
      "value": 79
    },
    {
      "name": "Utilities",
      "value": 11
    }
  ];


  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private dateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService
  ) { }

  ngOnInit = async () => {
    // await this.loadCRMIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadCRMIfCompanyExists();
  }
  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadCRMIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private loadCRMIfCompanyExists = async (): Promise<void> => {
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));

    if (this.companyRef <= 0) {
      await this.toastService.present('Please Select a Site', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.initializeDate(); // Ensures data refresh every time user re-enters
    await this.loadSitesByCompanyRef(); // Refresh site list
  }

  private initializeDate = async () => {
    try {
      this.loadingService.show();
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      const parts = this.strCDT.substring(0, 16).split('-');
      if (parts.length >= 3) {
        this.date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        await this.fetchFollowUps();
      }
    } catch (error) {
    } finally {
      this.loadingService.hide();
    }
  }

  onDateChange = async (date: string) => {
    try {
      this.loadingService.show();
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
    } finally {
      this.loadingService.hide();
    }
  }

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  private fetchFollowUps = async () => {
    try {
      this.loadingService.show();
      const followUps = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
        this.strCDT,
        this.InterestedPlotRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.followupList = this.FilterFollowupList = followUps;
    } catch (error) {
    } finally {
      this.loadingService.hide();
    }
  }

  private loadSitesByCompanyRef = async () => {
    try {
      this.loadingService.show()
      this.SiteList = [];
      this.PlotList = [];
      if (this.companyRef <= 0) {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.SiteList = await Site.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
    } catch (error) {
    } finally {
      this.loadingService.hide();
    }
  }

  loadPlotsBySiteRef = async (siteRef: number) => {
    try {
      this.loadingService.show()
      if (siteRef <= 0) {
        await this.toastService.present('Please select a site', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.InterestedPlotRef = 0;

      this.PlotList = await Plot.FetchEntireListBySiteandBookingRemarkRef(
        siteRef,
        BookingRemark.Booked,
        async (errMsg) => {
          await this.toastService.present('Error' + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
    } catch (error) {
    } finally {
      this.loadingService.hide()
    }
  }

  onFollowUpClick = async (followup: CustomerFollowUp) => {
    try {
      this.SelectedFollowUp = followup.GetEditableVersion();
      CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
      this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
      await this.router.navigate(['mobile-app/tabs/dashboard/customer-relationship-management/customer-followup/add']);
    } catch (error) {
    }
  }

  goToVisitedCustomer = () => {
    this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry']);
  }

  goToCustomerFollowUp = () => {
    this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup']);
  }
  goToPendingCustomerFollowUp = () => {
    this.router.navigate(['/mobile-app/tabs/dashboard/customer-relationship-management/pending-customer-followup']);
  }
}
