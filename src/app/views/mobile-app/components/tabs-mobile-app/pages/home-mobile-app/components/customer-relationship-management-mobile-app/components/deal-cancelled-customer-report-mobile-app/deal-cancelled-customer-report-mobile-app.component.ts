import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DealCancelledCustomer } from 'src/app/classes/domain/entities/website/customer_management/dealcancelledcustomer/dealcancelledcustomer';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-deal-cancelled-customer-report-mobile-app',
  templateUrl: './deal-cancelled-customer-report-mobile-app.component.html',
  styleUrls: ['./deal-cancelled-customer-report-mobile-app.component.scss'],
  standalone: false,
})
export class DealCancelledCustomerReportMobileAppComponent implements OnInit {
  Entity: DealCancelledCustomer = DealCancelledCustomer.CreateNewInstance();
  MasterList: DealCancelledCustomer[] = [];
  DisplayMasterList: DealCancelledCustomer[] = [];
  list: [] = []
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedDealCancelledCustomer: DealCancelledCustomer = DealCancelledCustomer.CreateNewInstance();
  CustomerRef: number = 0;
  companyRef: number = 0;
  ModalOpen: boolean = false;

  headers: string[] = ['Sr.No.', 'Site Name', 'Plot No', 'Customer Name', 'Address', 'City', 'Contact No', 'Reason '];

  filters: FilterItem[] = [];
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};


  constructor(
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit = (): void => {
    // this.loadDealCancelledCustomerReportIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadDealCancelledCustomerReportIfCompanyExists();
    this.loadFilters();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadDealCancelledCustomerReportIfCompanyExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  handlePrintOrShare = async () => {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Customer Info Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (!this.PrintContainer) return;
    await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.CustomerName}.pdf`);
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
        selected: this.selectedFilterValues['site'] > 0 ? this.selectedFilterValues['site'] : null,
      }
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
          break;
      }
    }
    if (this.Entity.p.SiteRef > 0) {
      await this.getDealCancelledCustomerListBySiteRef();
    } else {
      await this.getDealCancelledCustomerListByCompanyRef();
    }
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }
  private loadDealCancelledCustomerReportIfCompanyExists = async (): Promise<void> => {

    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.getSiteListByCompanyRef()
    await this.getDealCancelledCustomerListByCompanyRef();
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.Entity.p.SiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
    });
    this.SiteList = lst;
  }

  // Extracted from services date conversion //
  // formatDate = (date: string | Date): string => {
  //   return this.DateconversionService.formatDate(date);
  // }

  getDealCancelledCustomerListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await DealCancelledCustomer.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  getDealCancelledCustomerListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];

    let lst = await DealCancelledCustomer.FetchEntireListBySiteRef(this.Entity.p.SiteRef, this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  onViewClicked = async (item: DealCancelledCustomer) => {
    this.SelectedDealCancelledCustomer = item;
    this.ModalOpen = true;
  }

  closeModal = () => {
    this.ModalOpen = false;
  }
}
