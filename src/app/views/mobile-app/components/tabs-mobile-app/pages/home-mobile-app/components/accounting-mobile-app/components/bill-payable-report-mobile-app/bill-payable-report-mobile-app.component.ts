import { Component, OnInit } from '@angular/core';
import { ApplicationFeatures, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { InvoiceSumExpenseSum } from 'src/app/classes/domain/entities/website/Dashboard/invoicesumexpensesum/invoicesumexpensesum';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-bill-payable-report-mobile-app',
  templateUrl: './bill-payable-report-mobile-app.component.html',
  styleUrls: ['./bill-payable-report-mobile-app.component.scss'],
  standalone: false,
})
export class BillPayableReportMobileAppComponent implements OnInit {
  Entity: InvoiceSumExpenseSum = InvoiceSumExpenseSum.CreateNewInstance();
  MasterList: InvoiceSumExpenseSum[] = [];
  DisplayMasterList: InvoiceSumExpenseSum[] = [];
  SelectedInvoiceSumExpenseSum: InvoiceSumExpenseSum =
    InvoiceSumExpenseSum.CreateNewInstance();
  SiteList: Site[] = [];
  companyRef = 0;
  modalOpen = false;

  SelectedBillPayableMonths: number = 0;
  BillPayableFilterType: number = 57;

  MonthList = DomainEnums.MonthList();
  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};
  timeLineList = [
    {
      Ref: 57,
      Name: 'Weekly',
    },
    {
      Ref: 63,
      Name: 'Monthly',
    },
  ];

  Printheaders: string[] = [
    'Sr.No.',
    'Site Name',
    'Vendor Name',
    'Bill Amount',
    'Given Amount',
    'Remaining Amount',
    'Total Cash Received',
    'Total Cheque Received',
  ];

  featureRef: ApplicationFeatures = ApplicationFeatures.Billing;

  constructor(
    private appStateManage: AppStateManageService,
    private dateConversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService,
    public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit = async () => {
    // ngOnInit should be lean. ionViewWillEnter is better for data loading.
     this.access.refresh();
  };

  ionViewWillEnter = async () => {
    await this.loadInitialData();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadInitialData();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadInitialData() {
    await this.loadingService.show();
    try {
      this.companyRef = Number(
        this.appStateManage.localStorage.getItem('SelectedCompanyRef') || 0
      );

      if (this.companyRef <= 0) {
        await this.toastService.present(
          'Company not selected',
          1000,
          'warning'
        );
        await this.haptic.warning();
        return;
      }

      await this.fetchSiteList();
      await this.fetchInvoiceSumExpenseSumList();
      this.loadFilters();
    } catch (error) {
      await this.toastService.present('Failed to load data.', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  private loadFilters() {
    // Determine the currently selected timeline value or default to Weekly (57)
    const selectedTimelineRef =
      this.selectedFilterValues['timeline'] || this.BillPayableFilterType || 57;

    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map((site) => ({
          Ref: site.p.Ref,
          Name: site.p.Name,
        })),
        // Ensure site filter preserves its value, defaulting to 0 if none
        selected: this.selectedFilterValues['site'] ?? null,
      },
      {
        key: 'timeline',
        label: 'Timeline',
        multi: false,
        options: this.timeLineList,
        // Set the current timeline value
        selected: selectedTimelineRef,
      },
    ];

    // Conditionally add the Month filter only if the selected timeline is Monthly (63)
    if (selectedTimelineRef === 63) {
      this.filters.push({
        key: 'month',
        label: 'Month',
        multi: false,
        options: this.MonthList,
        // Preserve selected month value
        selected: this.selectedFilterValues['month'] ?? null,
      });
    }
  }

  async onFiltersChanged(updatedFilters: any[]) {
    await this.loadingService.show();
    try {
      // 1. Process all filter changes and update component state
      for (const filter of updatedFilters) {
        const selectedValue = filter.selected;

        // Save selected value to preserve after reload
        this.selectedFilterValues[filter.key] = selectedValue ?? null;

        switch (filter.key) {
          case 'site':
            this.Entity.p.SiteRef = selectedValue ?? 0;
            break;
          case 'timeline':
            this.BillPayableFilterType = selectedValue ?? 57;
            // If timeline changes from Monthly, reset month filter state
            if (this.BillPayableFilterType !== 63) {
              this.SelectedBillPayableMonths = 0;
              this.selectedFilterValues['month'] = null;
            }
            break;
          case 'month':
            this.SelectedBillPayableMonths = selectedValue ?? 0;
            break;
        }
      }

      // Default timeline if somehow set to 0
      if (this.BillPayableFilterType === 0) {
        this.BillPayableFilterType = 57;
      }

      // 2. Reload filters to correctly show/hide the Month filter based on the new Timeline value
      this.loadFilters();

      // 3. Fetch data based on the updated state
      await this.fetchInvoiceSumExpenseSumList();
    } catch (error) {
      await this.toastService.present(
        'Failed to apply filters.',
        1000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  private async fetchSiteList() {
    this.SiteList = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(
          `Error fetching sites: ${errMsg}`,
          1000,
          'danger'
        );
        await this.haptic.error();
      }
    );
  }

  private async fetchInvoiceSumExpenseSumList() {
    const list =
      await InvoiceSumExpenseSum.FetchEntireListByCompanySiteMonthFilterType(
        this.companyRef,
        this.Entity.p.SiteRef,
        this.SelectedBillPayableMonths,
        this.BillPayableFilterType,
        async (errMsg) => {
          await this.toastService.present(
            `Error fetching report: ${errMsg}`,
            1000,
            'danger'
          );
          await this.haptic.error();
        }
      );
    this.MasterList = list;
    this.DisplayMasterList = [...list];
  }

  async handlePrintOrShare() {
    if (this.DisplayMasterList.length === 0) {
      await this.toastService.present(
        'No records found to print.',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    }

    const data = this.DisplayMasterList.map((m, index) => [
      index + 1,
      m.p.SiteName || '--',
      m.p.RecipientName || '--',
      m.p.InvoiceAmount || '--',
      m.p.GivenAmount || '--',
      m.p.RemainingAmount || '--',
      m.p.TotalCashReceived || '--',
      m.p.TotalChequeReceived || '--',
    ]);

    await this.pdfService.generatePdfAndHandleAction(
      null,
      'Bill-Payable-Report.pdf',
      { headers: this.Printheaders, data },
      false,
      'l',
      [4, 5, 6, 7, 8],
      'Office Report'
    );
  }

  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  openModal(InvoiceSumExpenseSum: any) {
    this.SelectedInvoiceSumExpenseSum = InvoiceSumExpenseSum;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedInvoiceSumExpenseSum =
      InvoiceSumExpenseSum.CreateNewInstance();
  }
}
