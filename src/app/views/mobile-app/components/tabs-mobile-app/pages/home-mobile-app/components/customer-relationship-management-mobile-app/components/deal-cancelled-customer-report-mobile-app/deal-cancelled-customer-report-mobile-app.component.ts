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
  list: any[] = [];
  SiteList: Site[] = [];

  SearchString = '';
  SelectedDealCancelledCustomer: DealCancelledCustomer = DealCancelledCustomer.CreateNewInstance();
  CustomerRef = 0;
  companyRef = 0;
  ModalOpen = false;

  headers = ['Sr.No.', 'Site Name', 'Plot No', 'Customer Name', 'Address', 'City', 'Contact No', 'Reason'];

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};

  @ViewChild('PrintContainer') PrintContainer?: ElementRef<HTMLElement>;

  constructor(
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit(): void {
    // if needed for web support, otherwise rely on ionViewWillEnter
  }

  ionViewWillEnter = async (): Promise<void> => {
    await this.loadDealCancelledCustomerReportIfCompanyExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent): Promise<void> => {
    await this.loadDealCancelledCustomerReportIfCompanyExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  };

  handlePrintOrShare = async (): Promise<void> => {
    if (this.DisplayMasterList.length === 0) {
      await this.toastService.present('No Customer Info Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (!this.PrintContainer?.nativeElement) return;

    const fileName = this.Entity.p.CustomerName
      ? `Receipt_${this.Entity.p.CustomerName}.pdf`
      : `DealCancelledCustomers.pdf`;

    await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, fileName);
  };

  loadFilters = (): void => {
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['site'] ?? null,
      },
    ];
  };

  onFiltersChanged = async (updatedFilters: FilterItem[]): Promise<void> => {
    for (const filter of updatedFilters) {
      const selectedValue = filter.selected ?? null;
      this.selectedFilterValues[filter.key] = selectedValue;

      switch (filter.key) {
        case 'site':
          this.Entity.p.SiteRef = selectedValue ?? 0;
          break;
      }
    }

    this.getDealCancelledCustomerListBySiteRef()
    this.loadFilters();
  };

  private validateCompanySelected = async (): Promise<boolean> => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return false;
    }
    return true;
  };

  private loadDealCancelledCustomerReportIfCompanyExists = async (): Promise<void> => {
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    if (!(await this.validateCompanySelected())) return;

    await this.getSiteListByCompanyRef();
    await this.getDealCancelledCustomerListBySiteRef();
  };

  getSiteListByCompanyRef = async (): Promise<void> => {
    if (!(await this.validateCompanySelected())) return;

    this.Entity.p.SiteRef = 0;
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
  };

  getDealCancelledCustomerListByCompanyRef = async (): Promise<void> => {
    this.MasterList = [];
    this.DisplayMasterList = [];

    if (!(await this.validateCompanySelected())) return;

    this.MasterList = await DealCancelledCustomer.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });

    this.DisplayMasterList = [...this.MasterList];
  };

  getDealCancelledCustomerListBySiteRef = async (): Promise<void> => {
    this.MasterList = [];
    this.DisplayMasterList = [];

    this.MasterList = await DealCancelledCustomer.FetchEntireListBySiteRef(this.Entity.p.SiteRef, this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });

    this.DisplayMasterList = [...this.MasterList];
  };

  onViewClicked = (item: DealCancelledCustomer): void => {
    this.SelectedDealCancelledCustomer = item;
    this.ModalOpen = true;
  };

  closeModal = (): void => {
    this.ModalOpen = false;
  };
}
