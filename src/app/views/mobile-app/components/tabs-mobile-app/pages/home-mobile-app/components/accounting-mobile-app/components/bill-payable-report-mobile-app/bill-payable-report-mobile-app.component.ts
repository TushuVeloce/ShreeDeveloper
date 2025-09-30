import { Component, OnInit } from '@angular/core';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { InvoiceSumExpenseSum } from 'src/app/classes/domain/entities/website/Dashboard/invoicesumexpensesum/invoicesumexpensesum';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
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
    'Vendor Name',
    'Bill Amount',
    'Given Amount',
    'Remaining Amount',
    'Total Cash Received',
    'Total Cheque Received',
  ];

  constructor(
    private appStateManage: AppStateManageService,
    private dateConversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit = async () => {
    // ngOnInit should be lean. ionViewWillEnter is better for data loading.
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
    this.filters = [
      {
        key: 'timeline',
        label: 'Timeline',
        multi: false,
        options: this.timeLineList,
        selected: this.selectedFilterValues['timeline'] || 57,
      },
    ];

    if (this.selectedFilterValues['timeline'] == 63) {
      this.filters.push({
        key: 'month',
        label: 'Month',
        multi: false,
        options: this.MonthList,
        selected:
          this.selectedFilterValues['month'] > 0
            ? this.selectedFilterValues['month']
            : null,
      });
    }
  }

  // async onFiltersChanged(updatedFilters: any[]) {
  //   await this.loadingService.show();
  //   try {
  //     const selectedTimeLineRef = updatedFilters.find(
  //       (f) => f.key === 'timeline'
  //     )?.selected;
  //     this.selectedFilterValues['timeline'] = selectedTimeLineRef;

  //     // this.DisplayMasterList = selectedTimeLineRef
  //     //   ? this.MasterList.filter((item) => item.p.SiteRef === selectedTimeLineRef)
  //     //   : [...this.MasterList];

  //     this.Entity.p.SiteRef = selectedTimeLineRef ?? 0;
  //   } catch (error) {
  //     await this.toastService.present(
  //       'Failed to apply filters.',
  //       1000,
  //       'danger'
  //     );
  //     await this.haptic.error();
  //   } finally {
  //     await this.loadingService.hide();
  //   }

  //   await this.fetchInvoiceSumExpenseSumList();
  //   this.loadFilters();
  // }

  async onFiltersChanged(updatedFilters: any[]) {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue =
        selected === null || selected === undefined ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'timeline':
          this.BillPayableFilterType = selectedValue ?? 0;
          break;

        case 'month':
          this.SelectedBillPayableMonths = selectedValue ?? 0;
          break;
      }
    }

    if (this.BillPayableFilterType === 0) {
      this.BillPayableFilterType = 57;
    }

    await this.fetchInvoiceSumExpenseSumList();
    this.loadFilters(); // Reload filters with updated options & preserve selections
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
      await InvoiceSumExpenseSum.FetchEntireListByCompanySiteMonthFilterType(this.companyRef, this.Entity.p.SiteRef, this.SelectedBillPayableMonths, this.BillPayableFilterType,
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
      [3, 4, 5, 6, 7],
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
