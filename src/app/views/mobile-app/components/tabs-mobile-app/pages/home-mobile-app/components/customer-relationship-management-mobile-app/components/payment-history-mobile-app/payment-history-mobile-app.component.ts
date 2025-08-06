import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-payment-history-mobile-app',
  templateUrl: './payment-history-mobile-app.component.html',
  styleUrls: ['./payment-history-mobile-app.component.scss'],
  standalone: false
})
export class PaymentHistoryMobileAppComponent implements OnInit {
  Entity: Income = Income.CreateNewInstance();
  MasterList: Income[] = [];
  DisplayMasterList: Income[] = [];
  list: [] = []
  SiteList: Site[] = [];
  PlotList: Plot[] = [];
  SearchString: string = '';
  SelectedIncome: Income = Income.CreateNewInstance();
  CustomerRef: number = 0;
  companyRef: number = 0;
  Printheaders: string[] = ['Sr.No.', 'Date', 'Site Name', 'Payer Name', 'Amount', 'Mode of Payment', 'Reason'];
  headers: string[] = ['Sr.No.', 'Date', 'Site Name', 'Payer Name', 'Plot No.','Amount', 'Mode of Payment', 'Reason','Actions'];
  modalOpen = false;

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};


  constructor(
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit = async () => {
    // await this.loadPaymentHistoryReportIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadPaymentHistoryReportIfEmployeeExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent) => {
    await this.loadPaymentHistoryReportIfEmployeeExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  loadFilters = () => {
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.SiteList.find(item => item.p.Ref === this.selectedFilterValues['site'])
          ? this.selectedFilterValues['site']
          : null,
      },
      {
        key: 'plot',
        label: 'Plot No.',
        multi: false,
        options: this.PlotList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.PlotNo,
        })),
        selected: this.PlotList.find(item => item.p.Ref === this.selectedFilterValues['plot'])
          ? this.selectedFilterValues['plot']
          : null,
      },
    ];
  }

  onFiltersChanged = async (updatedFilters: any[]) => {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'site':
          this.Entity.p.SiteRef = selectedValue ?? 0;
          // Reset plot when Site changes
          this.PlotList = [];
          this.selectedFilterValues['plot'] = null;
          this.Entity.p.SubLedgerRef = 0;
          if (selectedValue != null) {
            await this.getPlotListBySiteRef(selectedValue);
          }
          break;
        case 'plot':
          this.Entity.p.PlotRef = selectedValue ?? 0;
          break;
      }
    }
    if (this.Entity.p.SiteRef > 0) {
      await this.getPaymentHistoryListBySiteRefAndPlotRef();
    }else {
      await this.getPaymentHistoryListByCompanyRef();
    }
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  handlePrintOrShare = async () => {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Payment History Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (!this.PrintContainer) return;
    await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Payment-History-Report.pdf`);
  }

  private loadPaymentHistoryReportIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      await this.getSiteListByCompanyRef();
      await this.getPaymentHistoryListByCompanyRef();
    } catch (error) {
      await this.toastService.present('Failed to load Payment History Report', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }
  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }
  getPlotListBySiteRef = async (siteref: number) => {
        this.Entity.p.PlotRef = 0
        this.PlotList = [];
        let lst = await Plot.FetchEntireListBySiteRef(siteref, async errMsg =>{
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
          });
        this.PlotList = lst;
      }

  getPaymentHistoryListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Income.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  getPaymentHistoryListBySiteRefAndPlotRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    let lst = await Income.FetchEntireListBySiteRef(this.Entity.p.SiteRef,this.Entity.p.PlotRef, this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  openModal = (Income: any) => {
    this.SelectedIncome = Income;
    this.modalOpen = true;
  }

  closeModal = () => {
    this.modalOpen = false;
    this.SelectedIncome = Income.CreateNewInstance();
  }
}
