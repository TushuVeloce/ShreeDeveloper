import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustomerSiteVisit } from 'src/app/classes/domain/entities/website/customer_management/customersitevisit/customersitevisit';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-customer-visit-report-mobile-app',
  templateUrl: './customer-visit-report-mobile-app.component.html',
  styleUrls: ['./customer-visit-report-mobile-app.component.scss'],
  standalone: false
})
export class CustomerVisitReportMobileAppComponent implements OnInit {
  Entity: CustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  MasterList: CustomerSiteVisit[] = [];
  DisplayMasterList: CustomerSiteVisit[] = [];
  list: [] = []
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedCustomerSiteVisit: CustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  CustomerRef: number = 0;
  companyRef: number = 0;

  Printheaders: string[] = ['Site Name', 'Plot No', 'Customer Name', 'Address', 'Contact No', 'Customer Requirement'];

  modalOpen = false;

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};


  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
    private utils: Utils,
    private pdfService: PDFService
  ) { }

  ngOnInit = async () => {
    // await this.loadCustomerVisitReportIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadCustomerVisitReportIfEmployeeExists();
    await this.loadFilters();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadCustomerVisitReportIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
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
    // debugger
    console.log('Updated Filters:', updatedFilters);

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
    await this.getInwardListBySiteRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Customer visit Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (!this.PrintContainer) return;
    await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
  }

  private async loadCustomerVisitReportIfEmployeeExists() {
    debugger
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
      await this.getInwardListByComapnyRef();
    } catch (error) {
      // console.error('Error in loadCustomerVisitReportIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Customer Visit Report', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getSiteListByCompanyRef = async () => {
    debugger
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SiteRef = 0
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
    // if (this.SiteList.length > 0) {
    //   this.Entity.p.SiteRef = this.SiteList[0].p.Ref
    //   this.getInwardListBySiteRef()
    // }
  }

  getInwardListByComapnyRef = async () => {
    debugger
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await CustomerSiteVisit.FetchEntireListBySiteRef(this.Entity.p.SiteRef, this.companyRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;

  };

  getInwardListBySiteRef = async () => {
    debugger
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.SiteRef <= 0) {
      this.getInwardListByComapnyRef();
      return;
    }
    let lst = await CustomerSiteVisit.FetchEntireListBySiteRef(this.Entity.p.SiteRef, this.companyRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
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

  openModal(CustomerSiteVisit: any) {
    this.SelectedCustomerSiteVisit = CustomerSiteVisit;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedCustomerSiteVisit = CustomerSiteVisit.CreateNewInstance();
  }
}
