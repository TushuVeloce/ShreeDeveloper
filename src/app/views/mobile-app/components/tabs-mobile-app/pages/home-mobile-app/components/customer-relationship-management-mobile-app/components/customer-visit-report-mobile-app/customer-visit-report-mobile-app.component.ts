import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerSiteVisit } from 'src/app/classes/domain/entities/website/customer_management/customersitevisit/customersitevisit';
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
  selector: 'app-customer-visit-report-mobile-app',
  templateUrl: './customer-visit-report-mobile-app.component.html',
  styleUrls: ['./customer-visit-report-mobile-app.component.scss'],
  standalone: false,
})
export class CustomerVisitReportMobileAppComponent implements OnInit {
  Entity: CustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  MasterList: CustomerSiteVisit[] = [];
  DisplayMasterList: CustomerSiteVisit[] = [];
  list: [] = [];
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedCustomerSiteVisit: CustomerSiteVisit =
    CustomerSiteVisit.CreateNewInstance();
  CustomerRef: number = 0;
  companyRef: number = 0;
  Printheaders: string[] = [
    'Sr. No.',
    'Site Name',
    'Plot No',
    'Customer Name',
    'Address',
    'Contact No',
    'Customer Requirement',
  ];
  modalOpen = false;

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};
  featureRef: ApplicationFeatures = ApplicationFeatures.CustomerVisitReport;
  showActionColumn = false;

  constructor(
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService,
    public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit = async () => {
    // await this.loadCustomerVisitReportIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    this.access.refresh();
    this.showActionColumn =
      this.access.canPrint(this.featureRef) ||
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    await this.loadCustomerVisitReportIfEmployeeExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent) => {
    await this.loadCustomerVisitReportIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  };

  loadFilters = () => {
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map((item) => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected:
          this.selectedFilterValues['site'] > 0
            ? this.selectedFilterValues['site']
            : null,
      },
    ];
  };

  onFiltersChanged = async (updatedFilters: any[]) => {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue =
        selected === null || selected === undefined ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'site':
          this.Entity.p.SiteRef = selectedValue ?? 0;
          break;
      }
    }
    await this.getInwardListBySiteRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  };
  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present(
        'No Customer visit Records Found',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    }
    // if (!this.PrintContainer) return;
    // await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
    const headers = this.Printheaders;
    const data = this.DisplayMasterList.map((m, index) => [
      index + 1,
      this.formatDate(m.p.TransDateTime),
      m.p.SiteName ? m.p.SiteName : '--',
      m.p.PlotNo ? m.p.PlotNo : '--',
      m.p.CustomerName ? m.p.CustomerName : '--',
      m.p.CustomerAddress ? m.p.CustomerAddress : '--',
      m.p.CustomerPhoneNo ? m.p.CustomerPhoneNo : '--',
      m.p.CustomerRequirement ? m.p.CustomerRequirement : '--',
    ]);

    await this.pdfService.generatePdfAndHandleAction(
      null,
      'Customer Visit Report.pdf',
      { headers, data },
      false,
      'l',
      [],
      'Customer Visit Report'
    );
  }

  private loadCustomerVisitReportIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();

      const company =
        this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present(
          'Company not selected',
          1000,
          'warning'
        );
        await this.haptic.warning();
        return;
      }
      await this.getSiteListByCompanyRef();
      await this.getInwardListByComapnyRef();
    } catch (error) {
      await this.toastService.present(
        'Failed to load Customer Visit Report',
        1000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  };

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SiteRef = 0;
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.SiteList = lst;
  };

  getInwardListByComapnyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await CustomerSiteVisit.FetchEntireListBySiteRef(
      this.Entity.p.SiteRef,
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  };

  getInwardListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.SiteRef <= 0) {
      this.getInwardListByComapnyRef();
      return;
    }
    let lst = await CustomerSiteVisit.FetchEntireListBySiteRef(
      this.Entity.p.SiteRef,
      this.companyRef,
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
  };

  openModal = (CustomerSiteVisit: any) => {
    this.SelectedCustomerSiteVisit = CustomerSiteVisit;
    this.modalOpen = true;
  };

  closeModal = () => {
    this.modalOpen = false;
    this.SelectedCustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  };
}
