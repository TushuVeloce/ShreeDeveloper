import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitRefs } from 'src/app/classes/domain/constants';
import {
  DomainEnums,
  ExpenseTypes,
  ModeOfPayments,
  RecipientTypes,
} from 'src/app/classes/domain/domainenums/domainenums';
import { InvoiceNoFetchRequest } from 'src/app/classes/domain/entities/website/accounting/billing/actualstagechalanfetchrequest';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { ServiceSuppliedByVendorProps } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Recipient } from 'src/app/classes/domain/entities/website/masters/recipientname/recipientname';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { LabourTimeProps } from 'src/app/classes/domain/entities/website/site_management/labourtime/labourtime';
import { MultipleExpenseProps } from 'src/app/classes/domain/entities/website/site_management/multipleexpense/multipleexpense';
import { TimeDetailProps } from 'src/app/classes/domain/entities/website/site_management/time/time';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-invoice-details-mobile-app',
  templateUrl: './invoice-details-mobile-app.component.html',
  styleUrls: ['./invoice-details-mobile-app.component.scss'],
  standalone: false,
})
export class InvoiceDetailsMobileAppComponent implements OnInit {
  Entity: Invoice = Invoice.CreateNewInstance();
  RecipientEntity: Recipient = Recipient.CreateNewInstance();
  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  RecipientList: Invoice[] = [];
  RecipientNameInput: boolean = false;
  SubLedgerList: SubLedger[] = [];
  UnitList: Unit[] = [];
  UnitListwithoutHours: Unit[] = [];
  VendorList: Vendor[] = [];
  VendorServiceList: ServiceSuppliedByVendorProps[] = [];
  VendorServiceListByVendor: VendorService[] = [];
  isDieselPaid: boolean = false;
  RecipientNameReadOnly: boolean = false;
  Bill = ModeOfPayments.Bill;
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(
    (item) => item.Ref == this.Bill
  );
  ExpenseTypeArrayList = DomainEnums.ExpenseTypeList();
  LabourTypeList = DomainEnums.LabourTypesList();
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Bill' | 'Edit Bill' = 'New Bill';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Invoice = null as any;
  LedgerList: Ledger[] = [];
  strCDT: string = '';
  MachineStartTime: string | null = null;
  MachineEndTime: string | null = null;

  LabourStartTime: string | null = null;
  LabourEndTime: string | null = null;

  MachinaryExpenseRef: number = ExpenseTypes.MachinaryExpense;
  LabourExpenseRef: number = ExpenseTypes.LabourExpense;
  OtherExpenseRef: number = ExpenseTypes.OtherExpense;
  StockExpenseRef: number = ExpenseTypes.StockExpense;
  TimeUnitRef: number = UnitRefs.TimeUnitRef;

  MachineTimeEntity: TimeDetailProps = TimeDetailProps.Blank();
  MachineEditingIndex: null | undefined | number;
  isTimeModalOpen: boolean = false;

  LabourTimeEntity: LabourTimeProps = LabourTimeProps.Blank();
  LabourEditingIndex: null | undefined | number;
  isLabourTimeModalOpen: boolean = false;

  TypeRecipientVendor = RecipientTypes.Vendor;
  TypeRecipient = RecipientTypes.Recipient;
  RecipientTypesList = DomainEnums.RecipientTypesList();
  timeheaders: string[] = ['Start Time ', 'End Time', 'Worked Hours'];
  labourtimeheaders: string[] = [
    'Labour Type',
    'Days',
    'Quantity ',
    'Rate',
    'Amount',
  ];
  materialheaders: string[] = [
    'Material',
    'Unit',
    'Order Quantity',
    'Rate',
    'Discount Rate',
    'Delivery Charges',
    'Total Amount',
  ];

  companyRef: number = 0;

  LedgerName: string = '';
  selectedLedger: any[] = [];

  SubLedgerName: string = '';
  selectedSubLedger: any[] = [];

  ExpenseTypeArrayName: string = '';
  selectedExpenseType: any[] = [];

  RecipientName: string = '';
  selectedRecipientName: any[] = [];

  RecipientTypeName: string = '';
  selectedRecipientType: any[] = [];

  selectedSite: any[] = [];
  SiteName: string = '';

  selectedVendor: any[] = [];
  VendorName: string = '';

  selectedMaterial: any[] = [];
  MaterialName: string = '';

  VendorServiceName: string = '';
  selectedVendorService: any[] = [];

  InvoiceModeOfPaymentName: string = '';
  selectedInvoiceModeOfPayment: any[] = [];

  LabourTypeName: string = '';
  selectedLabourType: any[] = [];

  UnitName: string = '';
  selectedUnit: any[] = [];

  MultipleUnitName: string = '';
  selectedMultipleUnit: any[] = [];

  TotalOrderedQty: number = 0;

  errors: string = '';
  InvoiceFile: File = null as any;
  ImageBaseUrl: string = '';
  TimeStamp = Date.now();
  LoginToken = '';

  imagePreView: string | null = '';
  imagePostView: string = '';
  imagePostViewUrl: string = '';
  selectedFileName: string = '';

  BillingDate: string | null = null;

  DisplayTotalWorkingHrs: string = '';

  MultipleExpenseEntity: MultipleExpenseProps = MultipleExpenseProps.Blank();
  MultipleEditingIndex: null | undefined | number;
  isMultipleExpenseModalOpen: boolean = false;
  MultipleHeaders: string[] = [
    'Discription',
    'Unit',
    'Quantity ',
    'Rate',
    'Amount',
  ];
  MultipleExpenseRef: number = ExpenseTypes.MultipleExpense;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utils: Utils,
    private datePipe: DatePipe,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService
  ) {}

  ngOnInit = async () => {
    // await this.loadInvoiceDetailsIfCompanyExists();
  };
  ionViewWillEnter = async () => {
    await this.loadInvoiceDetailsIfCompanyExists();
  };
  ngOnDestroy() {
    // Cleanup if needed
  }

  private loadInvoiceDetailsIfCompanyExists = async () => {
    try {
      await this.loadingService.show(); // Awaiting this is critical
      this.companyRef = Number(
        this.appStateManage.localStorage.getItem('SelectedCompanyRef')
      );

      if (this.companyRef > 0) {
        await this.getVendorListByCompanyRef();
        await this.getSiteListByCompanyRef();
        await this.getLedgerListByCompanyRef();
        await this.getUnitList();
        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Bill' : 'Edit Bill';
          this.Entity = Invoice.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable');
          this.Entity.p.UpdatedBy = Number(
            this.appStateManage.localStorage.getItem('LoginEmployeeRef')
          );

          this.selectedSite = [
            { p: { Ref: this.Entity.p.SiteRef, Name: this.Entity.p.SiteName } },
          ];
          this.SiteName = this.Entity.p.SiteName;

          this.selectedVendor = [
            {
              p: {
                Ref: this.Entity.p.RecipientRef,
                Name: this.Entity.p.RecipientName,
              },
            },
          ];
          this.VendorName = this.Entity.p.RecipientName;

          this.selectedLedger = [
            {
              p: {
                Ref: this.Entity.p.LedgerRef,
                Name: this.Entity.p.LedgerName,
              },
            },
          ];
          this.LedgerName = this.Entity.p.LedgerName;

          this.selectedLedger = [
            {
              p: {
                Ref: this.Entity.p.LedgerRef,
                Name: this.Entity.p.LedgerName,
              },
            },
          ];
          this.LedgerName = this.Entity.p.LedgerName;

          this.RecipientTypeName =
            this.RecipientTypesList.find(
              (item) => item.Ref == this.Entity.p.InvoiceRecipientType
            )?.Name ?? '';
          this.selectedRecipientType = [
            {
              p: {
                Ref: this.Entity.p.InvoiceRecipientType,
                Name: this.RecipientTypeName,
              },
            },
          ];

          this.selectedRecipientName = [
            {
              p: {
                Ref: this.Entity.p.RecipientRef,
                Name: this.Entity.p.RecipientName,
              },
            },
          ];
          this.RecipientName = this.Entity.p.RecipientName;

          this.selectedUnit = [
            { p: { Ref: this.Entity.p.UnitRef, Name: this.Entity.p.UnitName } },
          ];
          this.UnitName = this.Entity.p.UnitName;

          // ✅ Get names of all selected expense types
          this.ExpenseTypeArrayName =
            this.ExpenseTypeArrayList.filter((item) =>
              this.Entity.p.ExpenseTypeArray.includes(item.Ref)
            )
              .map((item) => item.Name)
              .join(', ') || '';

          // ✅ Set selectedExpenseType in the correct structure
          this.selectedExpenseType = this.Entity.p.ExpenseTypeArray.map(
            (ref) => {
              const item = this.ExpenseTypeArrayList.find((x) => x.Ref === ref);
              return { p: { Ref: ref, Name: item?.Name ?? '' } };
            }
          );

          this.InvoiceModeOfPaymentName =
            this.ModeofPaymentList.find(
              (item) => item.Ref == this.Entity.p.InvoiceModeOfPayment
            )?.Name ?? '';
          this.selectedInvoiceModeOfPayment = [
            {
              p: {
                Ref: this.Entity.p.InvoiceModeOfPayment,
                Name: this.InvoiceModeOfPaymentName,
              },
            },
          ];

          if (this.Entity.p.LedgerRef) {
            await this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
            this.selectedSubLedger = [
              {
                p: {
                  Ref: this.Entity.p.SubLedgerRef,
                  Name: this.Entity.p.SubLedgerName,
                },
              },
            ];
            this.SubLedgerName = this.Entity.p.SubLedgerName;
          }
          if (this.Entity.p.Date != '') {
            this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(
              this.Entity.p.Date
            );
            this.BillingDate = this.dtu.ConvertStringDateToShortFormat(
              this.Entity.p.Date
            );
          }
          if (this.Entity.p.IsDieselPaid == 1) {
            this.isDieselPaid = true;
          }
          if (
            this.Entity.p.ExpenseTypeArray.includes(this.MachinaryExpenseRef) ||
            this.Entity.p.ExpenseTypeArray.includes(this.LabourExpenseRef)
          ) {
            await this.getVendorServiceListByVendorRef(
              this.Entity.p.RecipientRef
            );
          }
          this.getTotalWorkedHours();
          this.selectedVendorService = [
            {
              p: {
                Ref: this.Entity.p.VendorServiceRef,
                Name: this.Entity.p.VendorServiceName,
              },
            },
          ];
          this.VendorServiceName = this.Entity.p.VendorServiceName;
        } else {
          this.Entity = Invoice.CreateNewInstance();
          Invoice.SetCurrentInstance(this.Entity);
          this.InvoiceModeOfPaymentName =
            this.ModeofPaymentList.find(
              (item) => item.Ref == ModeOfPayments.Bill
            )?.Name ?? '';
          this.selectedExpenseType = [
            {
              p: {
                Ref: ModeOfPayments.Bill,
                Name: this.InvoiceModeOfPaymentName,
              },
            },
          ];
          this.ExpenseTypeArrayList = this.ExpenseTypeArrayList.filter(
            (data) => data.Ref != this.StockExpenseRef
          );
          this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = this.strCDT.substring(0, 16).split('-');
          this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
          this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
          this.BillingDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.Date
          );
          await this.getChalanNo();
        }
        if (this.Entity.p.InvoiceRecipientType != 0) {
          this.getRecipientListByRecipientTypeRef();
        }
        this.InitialEntity = Object.assign(
          Invoice.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as Invoice;
      } else {
        await this.toastService.present(
          'company not selected',
          1000,
          'warning'
        );
        await this.haptic.warning();
      }
    } catch (error) {
      await this.toastService.present(
        'Failed to load Invoice details',
        1000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  };

  public onBillingDateChange = async (date: any): Promise<void> => {
    this.BillingDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? null;
    this.Entity.p.Date = this.BillingDate ?? '';
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

  getVendorListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.VendorList = [];
    let lst = await Vendor.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.VendorList = lst;
  };

  private FormulateVendorServiceList = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.VendorServiceListByVendor = [];
    let lst = await VendorService.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.VendorServiceListByVendor = lst;
  };

  getVendorServiceListByVendorRef = async (VendorRef: number) => {
    if (this.IsNewEntity) {
      this.Entity.p.VendorServiceRef = 0;
    }
    this.VendorServiceList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Vendor.FetchInstance(
      VendorRef,
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.VendorServiceList = lst.p.ServiceListSuppliedByVendor;
    this.VendorServiceListByVendor = []; // Clear existing list first
    this.selectedVendorService = [];
    this.VendorServiceName = '';
    if (this.VendorServiceList.length > 0) {
      await this.FormulateVendorServiceList();
      const refArray = this.VendorServiceList.map((s) => Number(s));
      const matched = this.VendorServiceListByVendor.filter((service) =>
        refArray.includes(service.p.Ref)
      );
      this.VendorServiceListByVendor = matched; // Either matched list or stays empty
    }
  };

  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async (errMsg) => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.UnitList = lst;
    this.UnitListwithoutHours = lst.filter(
      (data) => data.p.Ref != this.TimeUnitRef
    );
  };

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.SiteList = lst;
  };

  AddRecipientName = () => {
    this.RecipientNameInput = true;
    this.Entity.p.RecipientRef = 0;
    this.RecipientEntity.p.Name = '';
  };

  cancelRecipientName = () => {
    this.RecipientNameInput = false;
    this.RecipientEntity.p.Name = '';
  };

  onTypeChange = async () => {
    this.Entity.p.RecipientRef = 0;
    this.RecipientNameInput = false;
  };

  SaveNewRecipientName = async () => {
    try {
      await this.loadingService.show();
      if (this.RecipientEntity.p.Name == '') {
        await this.toastService.present(
          'Recipient Name can not be Blank',
          1000,
          'warning'
        );
        await this.haptic.warning();
        return;
      }
      this.RecipientEntity.p.CompanyRef = this.companyRef;
      this.RecipientEntity.p.CompanyName =
        this.companystatemanagement.getCurrentCompanyName();
      if (this.RecipientEntity.p.CreatedBy == 0) {
        this.RecipientEntity.p.CreatedBy = Number(
          this.appStateManage.localStorage.getItem('LoginEmployeeRef')
        );
        this.RecipientEntity.p.UpdatedBy = Number(
          this.appStateManage.localStorage.getItem('LoginEmployeeRef')
        );
      }
      let entityToSave = this.RecipientEntity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);

      if (!tr.Successful) {
        this.isSaveDisabled = false;
        await this.toastService.present(tr.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      } else {
        this.RecipientNameInput = false;
        await this.getRecipientListByRecipientTypeRef();

        this.RecipientEntity = Recipient.CreateNewInstance();
        await this.toastService.present(
          'Recipient Name saved successfully',
          1000,
          'success'
        );
        await this.haptic.success();
      }
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  };

    DiselPaid = (DiselPaid: number) => {
    if (DiselPaid == 1) {
      this.isDieselPaid = true;
      this.Entity.p.IsDieselPaid = 1;
    } else {
      this.Entity.p.DieselQty = 0;
      this.Entity.p.DieselRate = 0;
      this.Entity.p.DieselAmount = 0;
      this.Entity.p.IsDieselPaid = 0;
      this.isDieselPaid = false;
    }
    this.CalculateAmount();
  };

  CalculateDieselAmount = () => {
    const DieselQty = Number(this.Entity.p.DieselQty);
    const DieselRate = Number(this.Entity.p.DieselRate);
    this.Entity.p.DieselAmount = Math.round(DieselQty * DieselRate * 100) / 100;
    this.CalculateAmount();
  };

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.LedgerList = lst;
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.toastService.present('Ledger not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(
      ledgerref,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'warning');
        await this.haptic.error();
      }
    );
    this.SubLedgerList = lst;
  };

  OnLedgerChange = () => {
    this.Entity.p.SubLedgerRef = 0;
    this.selectedSubLedger = [];
    this.SubLedgerName = '';
  };
 convertHoursToReadableTime = (decimalHours: number): string => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);

    const hDisplay = hours > 0 ? `${hours}h` : '';
    const mDisplay = minutes > 0 ? `${minutes}m` : '';

    return `${hDisplay} ${mDisplay}`.trim() || '0m';
  };

  getTotalWorkedHours = (): number => {
    let total = this.Entity.p.MachineUsageDetailsArray.reduce(
      (total: number, item: any) => {
        return total + Number(item.WorkedHours || 0);
      },
      0
    );
    this.DisplayTotalWorkingHrs = this.formatMinutesToHourMin(total);
    return total;
  };
  formatMinutesToHourMin = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}h ${formattedMinutes}m`;
  };

    convertTo12HourFormat = (time: string): string => {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  calculateWorkedHours = () => {
    const start = this.MachineTimeEntity.StartTime;
    const end = this.MachineTimeEntity.EndTime;

    if (start && end) {
      const [startHour, startMin] = start.split(':').map(Number);
      const [endHour, endMin] = end.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMin, 0);

      const endDate = new Date();
      endDate.setHours(endHour, endMin, 0);

      let diffMs = endDate.getTime() - startDate.getTime();

      // If end time is before start time, assume it's the next day
      if (diffMs < 0) {
        endDate.setDate(endDate.getDate() + 1);
        diffMs = endDate.getTime() - startDate.getTime();
      }

      const diffMinutes = diffMs / (1000 * 60); // convert ms to hours
      // HH:mm format
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      this.MachineTimeEntity.WorkedHours = +diffMinutes;
      this.MachineTimeEntity.DisplayWorkedHours = `${hours}h ${minutes
        .toString()
        .padStart(2, '0')}m`;
    } else {
      this.MachineTimeEntity.WorkedHours = 0;
      this.MachineTimeEntity.DisplayWorkedHours = `0h 0m`;
    }
  };

  SaveTime = async () => {
    try {
      if (
        !this.MachineTimeEntity.StartTime ||
        !this.MachineTimeEntity.EndTime
      ) {
        await this.toastService.present(
          'Error ' + 'Start Time and End Time are required!',
          1000,
          'warning'
        );
        await this.haptic.warning();
        return;
      }

      if (
        this.MachineEditingIndex !== null &&
        this.MachineEditingIndex !== undefined &&
        this.MachineEditingIndex >= 0
      ) {
        this.Entity.p.MachineUsageDetailsArray[this.MachineEditingIndex] = {
          ...this.MachineTimeEntity,
        };
        await this.toastService.present(
          'Machinary Time updated successfully',
          1000,
          'success'
        );
        await this.haptic.success();
      } else {
        this.MachineTimeEntity.InvoiceRef = this.Entity.p.Ref;
        this.Entity.p.MachineUsageDetailsArray.push({
          ...this.MachineTimeEntity,
        });
        await this.toastService.present(
          'Machinary Time added successfully',
          1000,
          'success'
        );
        await this.haptic.success();
      }
    } catch (error) {
      await this.toastService.present(
        'Failed to save Machinary Time',
        1000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      this.MachineTimeEntity = TimeDetailProps.Blank();
      this.MachineEditingIndex = null;
      this.CalculateAmount();
      this.MachineStartTime = null;
      this.MachineEndTime = null;
      this.isTimeModalOpen = false;
    }
  };

  EditTime = (index: number) => {
    this.isTimeModalOpen = true;
    this.MachineTimeEntity = {
      ...this.Entity.p.MachineUsageDetailsArray[index],
    };
    this.MachineEditingIndex = index;
    this.MachineStartTime =
      this.convertHHMMToISOString(
        this.Entity.p.MachineUsageDetailsArray[index].StartTime
      ) ?? null;
    this.MachineEndTime =
      this.convertHHMMToISOString(
        this.Entity.p.MachineUsageDetailsArray[index].EndTime
      ) ?? null;
  };

  RemoveTime = (index: number) => {
    this.Entity.p.MachineUsageDetailsArray.splice(index, 1); // Remove Time
    this.CalculateAmount();
  };

  CloseTimeModal = async (type: number) => {
    if (type === 100) {
      const keysToCheck = ['StartTime', 'EndTime'] as const;

      const hasData = keysToCheck.some((key) =>
        (this.MachineTimeEntity as any)[key]?.toString().trim()
      );

      if (hasData) {
        this.alertService.presentDynamicAlert({
          header: 'Warning',
          subHeader: 'Confirmation needed',
          message:
            'You have unsaved data. Are you sure you want to go back? All data will be lost.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'custom-cancel',
              handler: () => {},
            },
            {
              text: 'Yes, Close',
              cssClass: 'custom-confirm',
              handler: () => {
                this.isTimeModalOpen = false;
                this.MachineTimeEntity = TimeDetailProps.Blank();
                this.haptic.success();
              },
            },
          ],
        });
      } else {
        this.isTimeModalOpen = false;
        this.MachineTimeEntity = TimeDetailProps.Blank();
      }
    }
  };

  getChalanNo = async () => {
    let req = new InvoiceNoFetchRequest();
    req.CompanyRef = this.companyRef;
    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    }

    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let collections = tdResult?.MainData?.Collections;

    if (Array.isArray(collections)) {
      for (const item of collections) {
        if (
          item.Name === 'Invoice' &&
          Array.isArray(item.Entries) &&
          item.Entries.length > 0
        ) {
          const entry = item.Entries[0] as { NextInvoiceNo: number };
          const NextInvoiceNo = entry.NextInvoiceNo;
          this.Entity.p.InvoiceNo = NextInvoiceNo;
          return;
        }
      }
    }
    await this.toastService.present(
      'Chalan number could not be retrieved.',
      1000,
      'danger'
    );
    await this.haptic.error();
  };

  getTotalLabourWorkedHours = (): number => {
    return this.Entity.p.LabourExpenseDetailsArray.reduce(
      (total: number, item: any) => {
        return total + Number(item.LabourWorkedHours || 0);
      },
      0
    );
  };

  getTotalLabourQuantity = (): number => {
    return this.Entity.p.LabourExpenseDetailsArray.reduce(
      (total: number, item: any) => {
        return total + Number(item.LabourQty || 0);
      },
      0
    );
  };
  getTotalLabourAmount = (): number => {
    return this.Entity.p.LabourExpenseDetailsArray.reduce(
      (total: number, item: any) => {
        return total + Number(item.LabourAmount || 0);
      },
      0
    );
  };



  CloseLabourTimeModal = async (type: number) => {
    if (type === 200) {
      const keysToCheck = ['StartTime', 'EndTime'] as const;

      const hasData = keysToCheck.some((key) =>
        (this.LabourTimeEntity as any)[key]?.toString().trim()
      );

      if (hasData) {
        this.alertService.presentDynamicAlert({
          header: 'Warning',
          subHeader: 'Confirmation needed',
          message:
            'You have unsaved data. Are you sure you want to go back? All data will be lost.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'custom-cancel',
              handler: () => {},
            },
            {
              text: 'Yes, Close',
              cssClass: 'custom-confirm',
              handler: () => {
                this.isLabourTimeModalOpen = false;
                this.LabourTimeEntity = LabourTimeProps.Blank();
                this.haptic.success();
                this.LabourTypeName = '';
                this.selectedLabourType = [];
                this.LabourEndTime = null;
                this.LabourStartTime = null;
              },
            },
          ],
        });
      } else {
        this.isLabourTimeModalOpen = false;
        this.LabourTimeEntity = LabourTimeProps.Blank();
      }
    }
  };
  calculateLaboursWorkedHours = () => {};

  SaveLabourTime = async () => {
    if (!this.LabourTimeEntity.Days) {
      await this.toastService.present('Days is required!', 1000, 'warning');
      await this.haptic.warning();
      return;
    } else if (!this.LabourTimeEntity.LabourRate) {
      await this.toastService.present('Rate is required!', 1000, 'warning');
      await this.haptic.warning();
      return;
    } else if (!this.LabourTimeEntity.LabourType) {
      await this.toastService.present(
        'Labour Type is required!',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    } else if (!this.LabourTimeEntity.LabourQty) {
      await this.toastService.present(
        'Labour Qty is required!',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    }
    if (this.LabourTimeEntity.LabourType != 0) {
      const labourtype = this.LabourTypeList.find(
        (item) => item.Ref == this.LabourTimeEntity.LabourType
      );
      this.LabourTimeEntity.LabourTypeName = labourtype?.Name || '';
    }
    if (
      this.LabourEditingIndex !== null &&
      this.LabourEditingIndex !== undefined &&
      this.LabourEditingIndex >= 0
    ) {
      this.Entity.p.LabourExpenseDetailsArray[this.LabourEditingIndex] = {
        ...this.LabourTimeEntity,
      };
      await this.toastService.present(
        'Labour Time updated successfully!',
        1000,
        'success'
      );
      await this.haptic.success();
      this.isLabourTimeModalOpen = false;
    } else {
      this.LabourTimeEntity.InvoiceRef = this.Entity.p.Ref;
      this.Entity.p.LabourExpenseDetailsArray.push({
        ...this.LabourTimeEntity,
      });
      await this.toastService.present(
        'Labour Time added successfully!',
        1000,
        'success'
      );
      await this.haptic.success();
      this.isLabourTimeModalOpen = false;
    }
    this.LabourTimeEntity = LabourTimeProps.Blank();
    this.LabourTypeName = '';
    this.selectedLabourType = [];
    this.LabourEditingIndex = null;
    this.CalculateAmount();
  };

  EditLabourTime = (index: number) => {
    this.isLabourTimeModalOpen = true;
    this.LabourTimeEntity = {
      ...this.Entity.p.LabourExpenseDetailsArray[index],
    };
    this.selectedLabourType = [
      {
        p: {
          Ref: this.Entity.p.LabourExpenseDetailsArray[index].LabourType,
          Name: this.Entity.p.LabourExpenseDetailsArray[index].LabourTypeName,
        },
      },
    ];
    this.LabourTypeName =
      this.Entity.p.LabourExpenseDetailsArray[index].LabourTypeName;
    this.LabourEditingIndex = index;
  };

  RemoveLabourTime = (index: number) => {
    this.Entity.p.LabourExpenseDetailsArray.splice(index, 1); // Remove Time
    this.CalculateAmount();
  };

  // ClearInputsOnExpenseChange = () => {
  //   this.Entity.p.MachineUsageDetailsArray = [];
  //   this.Entity.p.LabourExpenseDetailsArray = [];
  //   this.Entity.p.InvoiceRecipientType = 0;
  //   this.RecipientTypeName = '';
  //   this.selectedRecipientType = [];
  //   this.Entity.p.RecipientRef = 0;
  //   this.RecipientName = '';
  //   this.selectedRecipientName = [];
  //   this.RecipientNameInput = false;
  //   this.Entity.p.RecipientRef = 0;
  //   this.selectedVendor = [];
  //   this.VendorName = '';
  //   this.Entity.p.VendorServiceRef = 0;
  //   this.selectedVendorService = [];
  //   this.VendorServiceName = '';
  //   this.Entity.p.VehicleNo = '';
  //   this.Entity.p.Qty = 0;
  //   this.Entity.p.Rate = 0;
  //   this.CalculateAmount();
  //   this.DiselPaid(0);
  // };
  ClearInputsOnExpenseChange = () => {
    if (
      this.Entity.p.ExpenseTypeArray[0] == this.OtherExpenseRef &&
      this.Entity.p.ExpenseTypeArray.length == 2
    ) {
      let temp = this.Entity.p.ExpenseTypeArray[1];
      this.Entity.p.ExpenseTypeArray = [];
      this.Entity.p.ExpenseTypeArray.push(temp);
    }
    if (this.Entity.p.ExpenseTypeArray.includes(this.OtherExpenseRef)) {
      this.Entity.p.ExpenseTypeArray = [];
      this.Entity.p.ExpenseTypeArray.push(this.OtherExpenseRef);
      this.Entity.p.LabourExpenseDetailsArray = [];
      this.Entity.p.MachineUsageDetailsArray = [];
      this.Entity.p.InvoiceItemDetailsArray = [];
      this.Entity.p.Rate = 0;
    } else {
      this.Entity.p.InvoiceRecipientType = 0;
      this.RecipientTypeName = '';
      this.selectedRecipientType = [];
      this.Entity.p.RecipientRef = 0;
      this.selectedVendor = [];
      this.VendorName = '';
      this.RecipientNameInput = false;
      this.Entity.p.RecipientRef = 0;
      this.RecipientName = '';
      this.selectedRecipientName = [];
      this.Entity.p.VendorServiceRef = 0;
      this.selectedVendorService = [];
      this.VendorServiceName = '';
      this.Entity.p.VehicleNo = '';
      this.Entity.p.Qty = 0;
      if (!this.Entity.p.ExpenseTypeArray.includes(this.MachinaryExpenseRef)) {
        this.Entity.p.Rate = 0;
        this.Entity.p.UnitRef = 0;
      }
      this.DiselPaid(0);
    }
    if (this.Entity.p.ExpenseTypeArray.includes(this.MachinaryExpenseRef)) {
      this.Entity.p.UnitRef = this.TimeUnitRef;
      this.UnitName =
        this.UnitList.find((item) => item.p.Ref == this.Entity.p.UnitRef)?.p
          .Name ?? '';
      this.selectedUnit = [
        { p: { Ref: this.Entity.p.UnitRef, Name: this.UnitName } },
      ];
    }
    this.CalculateAmount();
  };

  ClearMachineTimeTable = () => {
    this.Entity.p.MachineUsageDetailsArray = [];
  };

  ClearInputsOnLabourType = () => {
    this.LabourTimeEntity.LabourQty = 0;
    this.LabourTimeEntity.LabourRate = 0;
    this.LabourTimeEntity.LabourAmount = 0;
  };
  CalculateLabourAmount = () => {
    if (
      this.LabourTimeEntity.Days == 0 ||
      !this.LabourTimeEntity.LabourRate ||
      !this.LabourTimeEntity.LabourQty
    ) {
      return;
    }
    const Qty = this.LabourTimeEntity.LabourQty;
    const Rate = this.LabourTimeEntity.LabourRate * this.LabourTimeEntity.Days;
    this.LabourTimeEntity.LabourAmount = Math.round(Qty * Rate * 100) / 100;
  };

  // ========================================================= Start Multiple Expense Code =========================================================

  CloseMultipleExpenseModal = async () => {
    this.isMultipleExpenseModalOpen = false;
    this.MultipleExpenseEntity = MultipleExpenseProps.Blank();
  };

  CalculateMultipleExpenseAmount = () => {
    if (
      this.MultipleExpenseEntity.Quantity <= 0 ||
      this.MultipleExpenseEntity.Rate <= 0
    ) {
      return;
    }
    this.MultipleExpenseEntity.Amount =
      this.MultipleExpenseEntity.Rate * this.MultipleExpenseEntity.Quantity;
  };

  getTotalMultipleExpenseAmount(): number {
    return this.Entity.p.InvoiceItemDetailsArray.reduce(
      (total: number, item: any) => {
        return total + Number(item.Amount || 0);
      },
      0
    );
  }

  SaveMultipleExpense = async () => {
    if (!this.MultipleExpenseEntity.Description) {
      await this.toastService.present(
        'Error: Description is required!',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    } else if (!this.MultipleExpenseEntity.UnitRef) {
      await this.toastService.present(
        'Error: Unit is required!',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    } else if (!this.MultipleExpenseEntity.Rate) {
      await this.toastService.present(
        'Error: Rate is required!',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    } else if (!this.MultipleExpenseEntity.Quantity) {
      await this.toastService.present(
        'Error: Quantity is required!',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    }
    // this.isMultiSaveDisabled = true;
    if (this.MultipleExpenseEntity.UnitRef != 0) {
      const UnitRecord = this.UnitListwithoutHours.find(
        (item) => item.p.Ref == this.MultipleExpenseEntity.UnitRef
      );
      this.MultipleExpenseEntity.UnitName = UnitRecord?.p.Name || '';
    }
    if (
      this.MultipleEditingIndex !== null &&
      this.MultipleEditingIndex !== undefined &&
      this.MultipleEditingIndex >= 0
    ) {
      this.Entity.p.InvoiceItemDetailsArray[this.MultipleEditingIndex] = {
        ...this.MultipleExpenseEntity,
      };
      this.isMultipleExpenseModalOpen = false;
    } else {
      this.MultipleExpenseEntity.InvoiceRef = this.Entity.p.Ref;
      this.Entity.p.InvoiceItemDetailsArray.push({
        ...this.MultipleExpenseEntity,
      });
      this.isMultipleExpenseModalOpen = false;
    }
    this.MultipleExpenseEntity = MultipleExpenseProps.Blank();
    this.MultipleEditingIndex = null;
    this.CalculateAmount();
  };

  EditMultipleExpense(index: number) {
    this.isMultipleExpenseModalOpen = true;
    this.MultipleExpenseEntity = {
      ...this.Entity.p.InvoiceItemDetailsArray[index],
    };
    this.MultipleEditingIndex = index;
  }

  RemoveMultipleExpense(index: number) {
    this.Entity.p.InvoiceItemDetailsArray.splice(index, 1); // Remove Time
    this.CalculateAmount();
  }

  // ========================================================= End Multiple Expense Code =========================================================

  // ---------- UTILITY METHODS ----------

  formatTimeToHHMM = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  formatToTrimmedISOString = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  convertHHMMToISOString = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return this.formatToTrimmedISOString(now.toISOString());
  };

  // ---------- TIME CHANGE EVENTS ----------

  MachineStartTimeChange = (value: string) => {
    this.MachineStartTime = value;
    this.MachineTimeEntity.StartTime = this.formatTimeToHHMM(value);
    this.calculateWorkedHours();
  };

  MachineEndTimeChange = (value: string) => {
    if (!this.MachineStartTime) {
      const now = new Date();
      this.MachineStartTimeChange(
        this.formatToTrimmedISOString(now.toISOString())
      );
    }
    this.MachineEndTime = value;
    this.MachineTimeEntity.EndTime = this.formatTimeToHHMM(value);
    this.calculateWorkedHours();
  };

  LabourStartTimeChange = (value: string) => {
    this.LabourStartTime = value;
    this.calculateLaboursWorkedHours();
  };

  LabourEndTimeChange = (value: string) => {
    if (!this.LabourStartTime) {
      const now = new Date();
      this.LabourStartTimeChange(
        this.formatToTrimmedISOString(now.toISOString())
      );
    }
    this.LabourEndTime = value;
    this.calculateLaboursWorkedHours();
  };

  getRecipientListByRecipientTypeRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (this.Entity.p.InvoiceRecipientType <= 0) {
      return;
    }
    if (!this.Entity.p.ExpenseTypeArray.includes(this.OtherExpenseRef)) {
      return;
    }

    this.RecipientList = [];
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(
      this.companyRef,
      this.Entity.p.SiteRef,
      this.Entity.p.InvoiceRecipientType,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.warning();
      }
    );
    this.RecipientList = lst;
  };

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  };

   CalculateAmount = () => {
    const TotalWorkedHours = this.getTotalWorkedHours()
    const TotalLabourAmount = this.getTotalLabourAmount()
    const TotalMultiExpenseAmount = this.getTotalMultipleExpenseAmount()
    const Qty = Number(this.Entity.p.Qty)
    const DieselAmount = Number(this.Entity.p.DieselAmount) || 0

    let Rate = 0;
    if (Number(this.Entity.p.Rate / 60) > 0) {
      Rate = Number(this.Entity.p.Rate / 60);
    }
    if (this.Entity.p.ExpenseTypeArray[0] == this.OtherExpenseRef && this.Entity.p.ExpenseTypeArray.length == 1) {
      this.Entity.p.InvoiceAmount = (Math.round(((Qty * this.Entity.p.Rate) - DieselAmount) * 100) / 100);
    } else {
      this.Entity.p.InvoiceAmount = (Math.round(((TotalWorkedHours * Rate) - DieselAmount) * 100) / 100) + (Math.round((TotalLabourAmount) * 100) / 100) + (Math.round((TotalMultiExpenseAmount) * 100) / 100);
    }
  }


  SaveInvoiceMaster = async () => {
    try {
      await this.loadingService.show();
      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName =
        this.companystatemanagement.getCurrentCompanyName();
      if (this.Entity.p.CreatedBy == 0) {
        this.Entity.p.CreatedBy = Number(
          this.appStateManage.localStorage.getItem('LoginEmployeeRef')
        );
        this.Entity.p.UpdatedBy = Number(
          this.appStateManage.localStorage.getItem('LoginEmployeeRef')
        );
      }
      this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(
        this.Entity.p.Date
      );
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);

      if (!tr.Successful) {
        this.isSaveDisabled = false;
        await this.toastService.present(tr.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      } else {
        this.isSaveDisabled = false;
        if (this.IsNewEntity) {
          await this.toastService.present(
            'Bill saved successfully',
            1000,
            'success'
          );
          await this.haptic.success();
        } else {
          await this.toastService.present(
            'Bill Updated successfully',
            1000,
            'success'
          );
          await this.haptic.success();
        }
      }
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    } finally {
      let parts = this.strCDT.substring(0, 16).split('-');
      this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      this.isDieselPaid = false;
      this.Entity = Invoice.CreateNewInstance();
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      await this.loadingService.hide();
      await this.router.navigate(
        ['/mobile-app/tabs/dashboard/accounting/invoice'],
        { replaceUrl: true }
      );
    }
  };

  onRecipientTypeVendor = () => {
    if (this.Entity.p.InvoiceRecipientType == this.TypeRecipientVendor) {
      this.Entity.p.RecipientRef = this.Entity.p.RecipientRef;
    }
  };

  public selectLabourTypeBottomsheet = async (): Promise<void> => {
    try {
      const options = this.LabourTypeList.map((item) => ({ p: item }));
      this.openSelectModal(
        options,
        this.selectedLabourType,
        false,
        'Select Labour Type',
        1,
        (selected) => {
          this.selectedLabourType = selected;
          this.LabourTimeEntity.LabourType = selected[0].p.Ref;
          this.LabourTypeName = selected[0].p.Name;
          this.ClearInputsOnLabourType();
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };
  public selectInvoiceModeOfPaymentBottomsheet = async (): Promise<void> => {
    try {
      const options = this.ModeofPaymentList.map((item) => ({ p: item }));
      this.openSelectModal(
        options,
        this.selectedInvoiceModeOfPayment,
        false,
        'Select Mode of Payment',
        1,
        (selected) => {
          this.selectedInvoiceModeOfPayment = selected;
          this.Entity.p.InvoiceModeOfPayment = selected[0].p.Ref;
          this.InvoiceModeOfPaymentName = selected[0].p.Name;
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };
  public selectMultipleUnitBottomsheet = async (): Promise<void> => {
    try {
      const options = this.UnitListwithoutHours;
      this.openSelectModal(
        options,
        this.selectedUnit,
        false,
        'Select Unit',
        1,
        (selected) => {
          this.selectedMultipleUnit = selected;
          this.MultipleExpenseEntity.UnitRef = selected[0].p.Ref;
          this.MultipleUnitName = selected[0].p.Name;
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectUnitBottomsheet = async (): Promise<void> => {
    try {
      const options = this.UnitList;
      this.openSelectModal(
        options,
        this.selectedUnit,
        false,
        'Select Unit',
        1,
        (selected) => {
          this.selectedUnit = selected;
          this.Entity.p.UnitRef = selected[0].p.Ref;
          this.UnitName = selected[0].p.Name;
          this.ClearMachineTimeTable();
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectVendorServiceBottomsheet = async (): Promise<void> => {
    try {
      const options = this.VendorServiceListByVendor;
      this.openSelectModal(
        options,
        this.selectedVendorService,
        false,
        'Select Vendor Service',
        1,
        (selected) => {
          this.selectedVendorService = selected;
          this.Entity.p.VendorServiceRef = selected[0].p.Ref;
          this.VendorServiceName = selected[0].p.Name;
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectVendorBottomsheet = async (): Promise<void> => {
    try {
      const options = this.VendorList;
      this.openSelectModal(
        options,
        this.selectedVendor,
        false,
        'Select Vendor Name',
        1,
        (selected) => {
          this.selectedVendor = selected;
          this.Entity.p.RecipientRef = selected[0].p.Ref;
          this.VendorName = selected[0].p.Name;
          this.getVendorServiceListByVendorRef(this.Entity.p.RecipientRef);
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectRecipientTypeBottomsheet = async (): Promise<void> => {
    try {
      const options = this.RecipientTypesList.map((item) => ({ p: item }));
      this.openSelectModal(
        options,
        this.selectedRecipientType,
        false,
        'Select Recipient Type',
        1,
        (selected) => {
          this.selectedRecipientType = selected;
          this.Entity.p.InvoiceRecipientType = selected[0].p.Ref;
          this.RecipientTypeName = selected[0].p.Name;
          this.getRecipientListByRecipientTypeRef();
          this.onTypeChange();
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectRecipientNameBottomsheet = async (): Promise<void> => {
    try {
      let options: any[] = [];
      if (options) {
        options = this.RecipientList.map((item) => ({
          p: {
            Ref: item.p.Ref,
            Name: item.p.RecipientName,
          },
        }));
      }
      this.openSelectModal(
        options,
        this.selectedRecipientName,
        false,
        'Select Recipient Name',
        1,
        (selected) => {
          this.selectedRecipientName = selected;
          this.Entity.p.RecipientRef = selected[0].p.Ref;
          this.RecipientName = selected[0].p.Name;
          this.onRecipientTypeVendor();
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectExpenseTypeArrayBottomsheet = async (): Promise<void> => {
    try {
      const options = this.ExpenseTypeArrayList.map((item) => ({ p: item }));
      this.openSelectModal(
        options,
        this.selectedExpenseType,
        true,
        'Select Expense Type',
        4,
        (selected) => {
          this.selectedExpenseType = selected;


          // ✅ Extract all selected Ref values as an array
          this.Entity.p.ExpenseTypeArray = selected.map((s) => s.p.Ref);

          // ✅ If you want to show joined names
          this.ExpenseTypeArrayName = selected.map((s) => s.p.Name).join(', ');

          this.ClearInputsOnExpenseChange();
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectSubLedgerBottomsheet = async (): Promise<void> => {
    try {
      const options = this.SubLedgerList;
      this.openSelectModal(
        options,
        this.selectedSubLedger,
        false,
        'Select Sub Ledger',
        1,
        (selected) => {
          this.selectedSubLedger = selected;
          this.Entity.p.SubLedgerRef = selected[0].p.Ref;
          this.SubLedgerName = selected[0].p.Name;
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectLedgerBottomsheet = async (): Promise<void> => {
    try {
      const options = this.LedgerList;
      this.openSelectModal(
        options,
        this.selectedLedger,
        false,
        'Select Ledger',
        1,
        (selected) => {
          this.selectedLedger = selected;
          this.Entity.p.LedgerRef = selected[0].p.Ref;
          this.LedgerName = selected[0].p.Name;
          this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
          this.OnLedgerChange();
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };

  public selectSiteBottomsheet = async (): Promise<void> => {
    try {
      const options = this.SiteList;
      this.openSelectModal(
        options,
        this.selectedSite,
        false,
        'Select Site',
        1,
        (selected) => {
          this.selectedSite = selected;
          this.Entity.p.SiteRef = selected[0].p.Ref;
          this.SiteName = selected[0].p.Name;
          this.getRecipientListByRecipientTypeRef();
        }
      );
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  };
  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(
      dataList,
      selectedItems,
      multiSelect,
      title,
      MaxSelection
    );
    if (selected) updateCallback(selected);
  }
  isDataFilled(): boolean {
    const emptyEntity: Invoice = Invoice.CreateNewInstance();
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.Date']);
  }

  deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
    const clean = (obj: any, path = ''): any => {
      if (obj === null || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        if (ignorePaths.includes(fullPath)) continue;
        result[key] = clean(obj[key], fullPath);
      }
      return result;
    };

    const cleanedObj1 = clean(obj1);
    const cleanedObj2 = clean(obj2);

    return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
  }

  goBack = async () => {
    // Replace this with your actual condition to check if data is filled
    const isDataFilled = this.isDataFilled(); // Implement this function based on your form

    if (isDataFilled) {
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message:
          'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {},
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: () => {
              this.router.navigate(
                ['/mobile-app/tabs/dashboard/accounting/invoice'],
                { replaceUrl: true }
              );
              this.haptic.success();
            },
          },
        ],
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/accounting/invoice'], {
        replaceUrl: true,
      });
      this.haptic.success();
    }
  };
}
