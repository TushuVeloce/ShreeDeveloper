import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockSummary } from 'src/app/classes/domain/entities/website/stock_management/stock-summary/stoctsummary';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-stock-summary-mobile-app',
  templateUrl: './stock-summary-mobile-app.component.html',
  styleUrls: ['./stock-summary-mobile-app.component.scss'],
  standalone: false
})
export class StockSummaryMobileAppComponent implements OnInit {

  Entity: StockSummary = StockSummary.CreateNewInstance();
  MasterList: StockSummary[] = [];
  DisplayMasterList: StockSummary[] = [];
  SearchString: string = '';
  SelectedStockSummary: StockSummary = StockSummary.CreateNewInstance();
  CustomerRef: number = 0;
  SiteList: Site[] = [];
  headers: string[] = ['Sr.No.', 'Site Name', 'Material', 'Total Requisition Qty', 'Ordered Qty', 'Extra Ordered Qty', 'Total Inward Qty ', 'Inward Remaining Qty', 'Total Consumed Qty ', 'Transferred Out Qty ', 'Current Stock ', 'Ordered Remaining Qty'];


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
    private DateconversionService: DateconversionService,
    private pdfService: PDFService
  ) { }

  ngOnInit(): void {
  }

  ionViewWillEnter = async () => {
    await this.loadStockSummaryReportIfCompanyExists();
    this.loadFilters();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadStockSummaryReportIfCompanyExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Stock Summary Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (!this.PrintContainer) return;
    await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.PurchaseOrderDate}.pdf`);
  }
  loadFilters() {
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['site'] > 0 ? this.selectedFilterValues['site'] : null,
      }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'site':
          this.Entity.p.SiteRef = selectedValue ?? 0;
          break;
      }
    }
    if (this.Entity.p.SiteRef > 0) {
      await this.getStockSummaryListByCompanyRefAndSiteRef();
    } else {
      await this.getStockSummaryListByCompanyRef();
    }
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

  private async loadStockSummaryReportIfCompanyExists(): Promise<void> {
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
      await this.getStockSummaryListByCompanyRef();
      this.loadFilters();
    } catch (error) {
      await this.toastService.present('Error loading stock summary report', 1000, 'danger');
      await this.haptic.error();
    } finally {
      this.loadingService.hide();
    }
  }

  FormulateSiteListByCompanyRef = async () => {
    try {
      this.SiteList = [];

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }

      const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'warning');
        await this.haptic.warning();
      });

      this.SiteList = lst;
    } catch (error) {
      await this.toastService.present('Error in FormulateSiteListByCompanyRef:' + error, 1000, 'warning');
      await this.haptic.warning();
    }
  }

  getStockSummaryListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await StockSummary.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  getStockSummaryListByCompanyRefAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.SiteRef <= 0) {
      this.getStockSummaryListByCompanyRef();
      return;
    }
    let lst = await StockSummary.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.SiteRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  public selectSiteBottomsheet = async (): Promise<void> => {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;
        this.SiteName = selected[0].p.Name;
        this.Entity.p.Ref = selected[0].p.Ref;
      });
    } catch (error) {
      await this.toastService.present('Error in selectSiteBottomsheet:' + error, 1000, 'danger');
      await this.haptic.error();
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

  onViewClicked = (item: StockSummary) => {
    this.SelectedStockSummary = item;
    this.ModalOpen = true;
  }

  closeModal = () => {
    this.ModalOpen = false;
  }
}
