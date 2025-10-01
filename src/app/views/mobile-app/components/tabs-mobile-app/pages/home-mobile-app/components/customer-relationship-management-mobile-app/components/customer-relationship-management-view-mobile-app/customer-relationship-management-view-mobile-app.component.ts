import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-customer-relationship-management-view-mobile-app',
  templateUrl:
    './customer-relationship-management-view-mobile-app.component.html',
  styleUrls: [
    './customer-relationship-management-view-mobile-app.component.scss',
  ],
  standalone: false,
})
export class CustomerRelationshipManagementViewMobileAppComponent
  implements OnInit, AfterViewInit
{
  // === ViewChild for Charts ===
  @ViewChild('salesFunnelChart') private salesFunnelChartRef!: ElementRef;
  @ViewChild('monthlyTrendsChart') private monthlyTrendsChartRef!: ElementRef;

  // === KPI and Chart Data ===
  public newLeadsThisMonth: number = 0;
  public todaysFollowups: number = 0;
  public convertedLeads: number = 0;

  private salesFunnelData = {
    labels: ['New Lead', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [300, 50, 100, 20],
        backgroundColor: ['#2B6CB0', '#F6AD55', '#38A169', '#E53E3E'],
        hoverOffset: 4,
      },
    ],
  };

  private monthlyTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Leads',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#2B6CB0',
        backgroundColor: 'rgba(43, 108, 176, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Converted Leads',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: '#38A169',
        backgroundColor: 'rgba(56, 161, 105, 0.2)',
        tension: 0.4,
      },
      {
        label: 'canceled Leads',
        data: [2, 5, 5, 9, 8, 17],
        borderColor: '#a13838ff',
        backgroundColor: 'rgba(161, 56, 56, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // === Quick Action Grid Data ===
  public gridItems = [
    {
      icon: 'assets/icons/customer_enquiry_mobile_app.png',
      label: 'Customer Enquiry',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/customer-enquiry',
    },
    {
      icon: 'assets/icons/customer_followup_mobile_app.png',
      label: 'Followup',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup',
    },
    {
      icon: 'assets/icons/pending_follow_up_mobile_app.png',
      label: 'Pending Followup',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/pending-customer-followup',
    },
    {
      icon: 'assets/icons/customer_info_report_mobile_app.png',
      label: 'Customer Info Report',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/customer-info-report',
    },
    {
      icon: 'assets/icons/customer_summary_report_mobile_app.png',
      label: 'Customer Summary Report',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/customer-summary-report',
    },
    {
      icon: 'assets/icons/customer_visit_report_mobile_app.png',
      label: 'Customer Visit Report',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/customer-visit-report',
    },
    {
      icon: 'assets/icons/Payment_History_Report_md.png',
      label: 'Payment History Report',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/payment-history-report',
    },
    {
      icon: 'assets/icons/Deal_Cancelled_Customer_Report_md.png',
      label: 'Deal Cancelled Customer Report',
      routerPath:
        '/mobile-app/tabs/dashboard/customer-relationship-management/deal-cancelled-customer-report',
    },
  ];

  // === Follow-Up Reminder Data ===
  public FilterFollowupList: CustomerFollowUp[] = [];
  private SelectedFollowUp: CustomerFollowUp =
    CustomerFollowUp.CreateNewInstance();

  // === Other Properties ===
  private companyRef: number = 0;
  private strCDT: string = '';

  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private dateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService
  ) {}

  ngOnInit = async () => {
    // A lean ngOnInit is good practice. Data loading is better in ionViewWillEnter.
  };

  // Lifecycle hook for view initialization (used for charts)
  ngAfterViewInit() {
    this.createChart(
      this.salesFunnelChartRef,
      'doughnut',
      this.salesFunnelData,
      { responsive: true, plugins: { legend: { position: 'bottom' } } }
    );
    this.createChart(
      this.monthlyTrendsChartRef,
      'line',
      this.monthlyTrendsData,
      { responsive: true , plugins: { legend: { position: 'bottom' } }}
    );
  }

  ionViewWillEnter = async () => {
    await this.loadCRMData();
  };

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadCRMData();
    (event.target as HTMLIonRefresherElement).complete();
  };

  // === Data Fetching Methods ===
  private loadCRMData = async (): Promise<void> => {
    await this.loadingService.show();
    try {
      this.companyRef = Number(
        this.appStateManagement.localStorage.getItem('SelectedCompanyRef') || 0
      );

      if (this.companyRef <= 0) {
        await this.toastService.present('Please Select a Site', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      // Placeholder for fetching KPI and chart data from an API
      // For now, we'll use mock data and assign it to the properties
      this.newLeadsThisMonth = 125;
      this.todaysFollowups = 8;
      this.convertedLeads = 24;

      await this.initializeDate();
    } catch (error) {
      await this.toastService.present(
        'Failed to load dashboard data.',
        1000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      this.loadingService.hide();
    }
  };

  private initializeDate = async () => {
    try {
      const currentDateTime = await CurrentDateTimeRequest.GetCurrentDateTime();
      const parts = currentDateTime.substring(0, 16).split('-');
      if (parts.length >= 3) {
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        await this.fetchFollowUps();
      }
    } catch (error) {
    }
  };

  private fetchFollowUps = async () => {
    try {
      const followUps = await CustomerFollowUp.FetchEntireListByDateandPlotRef(
        this.strCDT,
        0, // Assuming InterestedPlotRef is 0 for all plots
        async (errMsg) => {
          await this.toastService.present(`Error: ${errMsg}`, 1000, 'danger');
          await this.haptic.error();
        }
      );
      this.FilterFollowupList = followUps;
    } catch (error) {
    }
  };

  // === Chart Helper Method ===
  private createChart(
    chartRef: ElementRef,
    type: 'doughnut' | 'line' | 'bar' | 'pie',
    data: any,
    options: any
  ) {
    if (chartRef?.nativeElement) {
      new Chart(chartRef.nativeElement, { type, data, options });
    }
  }

  // === Other Helper Methods ===
  public onFollowUpClick = async (followup: CustomerFollowUp) => {
    try {
      this.SelectedFollowUp = followup.GetEditableVersion();
      CustomerFollowUp.SetCurrentInstance(this.SelectedFollowUp);
      this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
      await this.router.navigate([
        'mobile-app/tabs/dashboard/customer-relationship-management/customer-followup/add',
      ]);
    } catch (error) {
    }
  };
}
