import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-customer-info-report-mobile-app',
  templateUrl: './customer-info-report-mobile-app.component.html',
  styleUrls: ['./customer-info-report-mobile-app.component.scss'],
  standalone: false,
})
export class CustomerInfoReportMobileAppComponent implements OnInit {
  Entity: CRMReports = CRMReports.CreateNewInstance();
  MasterList: CRMReports[] = [];
  DisplayMasterList: CRMReports[] = [];
  SelectedCRMReports: CRMReports = CRMReports.CreateNewInstance();
  SiteList: Site[] = [];
  CustomerList: CRMReports[] = [];
  SiteRef: number = 0;
  CustomerRef: number = 0;
  ModalOpen: boolean = false;
  companyRef = 0;

  headers: string[] = [
    'Sr.No.',
    'Customer ID',
    'Customer Name',
    'Address',
    'Contact No',
    'PAN No',
    'Aadhar No',
    'Lead Source',
    'Lead Handle By',
    'Agent/Broker',
    'Booking Remark',
    'Plot No',
    'Area in Sqm',
    'Area in Sqft',
    'Basic Rate',
    'Discount Rate on Area',
    'Discount On Plot Amount',
    'Total Plot Amount',
    'Government Recknor',
    'Government Value',
    'Value of Agreement',
    'Reg Tax Value In %',
    'Registration Fees',
    'SD Tax Value In %',
    'Stamp Duties',
    'Goods Services Tax',
    'Legal Charges',
    'Total Extra Charges',
    'Grand Total',
    'Total Cheque Recieved',
    'Total Cash Recieved',
    'Total Recieved (cash + cheque)',
    'Total Cheque Balance',
    'Total Cash Balance',
    'Total Balance',
  ];
  filters: FilterItem[] = [];
  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};

  constructor(
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private pdfService: PDFService
  ) {}

  ngOnInit = (): void => {
    // this.loadCustomerInfoReportIfCompanyExists();
  };

  ionViewWillEnter = async () => {
    await this.loadCustomerInfoReportIfCompanyExists();
    this.loadFilters();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadCustomerInfoReportIfCompanyExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present(
        'No Customer Info Records Found',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    }

    const headers = this.headers; // Assuming this array holds all 35 column headers
    const data = this.DisplayMasterList.map((m, index) => [
      index + 1,
      m.p.CustID ? m.p.CustID : '--',
      m.p.CustomerName ? m.p.CustomerName : '--',
      m.p.CustomerAddress ? m.p.CustomerAddress : '--',
      m.p.ContactNos ? m.p.ContactNos : '--',
      m.p.PANNo ? m.p.PANNo : '--',
      m.p.AdharNo ? m.p.AdharNo : '--',
      m.p.LeadSourceName ? m.p.LeadSourceName : '--',
      m.p.LeadHandleByName ? m.p.LeadHandleByName : '--',
      m.p.BrokerName ? m.p.BrokerName : '--',
      m.p.RegisterCustomerBookingRemarkName
        ? m.p.RegisterCustomerBookingRemarkName
        : '--',
      m.p.PlotNo ? m.p.PlotNo : '--',
      m.p.AreaInSqm ? m.p.AreaInSqm : '--',
      m.p.AreaInSqft ? m.p.AreaInSqft : '--',
      m.p.BasicRate ? m.p.BasicRate : '--',
      m.p.DiscountedRateOnArea ? m.p.DiscountedRateOnArea : '--',
      m.p.DiscountOnTotalPlotAmount ? m.p.DiscountOnTotalPlotAmount : '--',
      m.p.TotalPlotAmount ? m.p.TotalPlotAmount : '--',
      m.p.GovernmentRecknor ? m.p.GovernmentRecknor : '--',
      m.p.GovernmentValue ? m.p.GovernmentValue : '--',
      m.p.ValueOfAgreement ? m.p.ValueOfAgreement : '--',
      '1%',
      m.p.RegistrationFees ? m.p.RegistrationFees : '--',
      m.p.TaxValueInPercentage != null ? m.p.TaxValueInPercentage + '%' : '--',
      m.p.StampDuties ? m.p.StampDuties : '--',
      m.p.GoodsServicesTax != null ? m.p.GoodsServicesTax + '%' : '--',
      m.p.LegalCharges ? m.p.LegalCharges : '--',
      m.p.TotalExtraCharges ? m.p.TotalExtraCharges : '--',
      m.p.GrandTotal ? m.p.GrandTotal : '--',
      m.p.TotalChequeReceived ? m.p.TotalChequeReceived : '--',
      m.p.TotalCashReceived ? m.p.TotalCashReceived : '--',
      m.p.TotalAmountReceived ? m.p.TotalAmountReceived : '--',
      m.p.TotalChequeBalance ? m.p.TotalChequeBalance : '--',
      m.p.TotalCashBalance ? m.p.TotalCashBalance : '--',
      m.p.TotalBalance ? m.p.TotalBalance : '--',
    ]);

    // **REQUIRED INPUTS FOR DYNAMIC SPLIT**
    const COLUMNS_PER_PAGE = 10; // Set this number based on how many columns fit on a landscape page
    const ORIENTATION = 'l'; // Use 'l' for Landscape

    await this.pdfService.generateDynamicSplitReport(
      'Customer Info Report.pdf',
      { headers, data },
      COLUMNS_PER_PAGE,
      ORIENTATION,
      'Customer Info Report'
    );
  }

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
          this.SiteRef = selectedValue ?? 0;
          break;
      }
    }
    if (this.SiteRef > 0) {
      await this.getCustomerReportByCompanyAndSiteRef();
    } else {
      await this.getCustomerReportByCompanyRef();
    }
    this.loadFilters(); // Reload filters with updated options & preserve selections
  };
  private loadCustomerInfoReportIfCompanyExists = async (): Promise<void> => {
    this.companyRef = Number(
      this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
    );
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.FormulateSiteListByCompanyRef();
    await this.getCustomerReportByCompanyRef();
  };

  FormulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    this.SiteRef = 0;
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
      }
    );
    this.SiteList = lst;
  };
  getCustomerReportByCompanyRef = async () => {
    try {
      await this.loadingService.show();
      this.MasterList = [];
      this.DisplayMasterList = [];
      if (this.companyRef <= 0) {
        await this.toastService.present('Site not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      let lst = await CRMReports.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
        }
      );
      this.DisplayMasterList = lst;
    } catch (error) {
    } finally {
      await this.loadingService.hide();
    }
  };
  getCustomerReportByCompanyAndSiteRef = async () => {
    try {
      await this.loadingService.show();
      this.MasterList = [];
      this.DisplayMasterList = [];
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      if (this.SiteRef <= 0) {
        await this.toastService.present('Site not selected', 1000, 'danger');
        return;
      }
      let lst = await CRMReports.FetchEntireListByCompanyAndSiteRef(
        this.companyRef,
        this.SiteRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
        }
      );
      this.DisplayMasterList = lst;
    } catch (error) {
    } finally {
      await this.loadingService.hide();
    }
  };

  OnCustomerSelection = () => {
    let report = this.CustomerList.filter(
      (data) => data.p.CustomerEnquiryRef == this.CustomerRef
    );
    if (report.length > 0) {
      this.Entity = report[0];
    }
  };

  onViewClicked = async (item: CRMReports) => {
    this.SelectedCRMReports = item;
    this.ModalOpen = true;
  };

  closeModal = () => {
    this.ModalOpen = false;
  };
}
