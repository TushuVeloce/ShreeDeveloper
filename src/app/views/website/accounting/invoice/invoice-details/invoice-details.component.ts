import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Recipient } from 'src/app/classes/domain/entities/website/masters/recipientname/recipientname';
import { UnitRefs, ValidationMessages } from 'src/app/classes/domain/constants';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { InvoiceNoFetchRequest } from 'src/app/classes/domain/entities/website/accounting/billing/actualstagechalanfetchrequest';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { DomainEnums, ExpenseTypes, ModeOfPayments, RecipientTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { ServiceSuppliedByVendorProps, Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { TimeDetailProps } from 'src/app/classes/domain/entities/website/site_management/time/time';
import { LabourTimeProps } from 'src/app/classes/domain/entities/website/site_management/labourtime/labourtime';

@Component({
  selector: 'app-invoice-details',
  standalone: false,
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
})
export class InvoiceDetailsComponent implements OnInit {
  Entity: Invoice = Invoice.CreateNewInstance();
  RecipientEntity: Recipient = Recipient.CreateNewInstance();
  IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  // RecipientList: Recipient[] = [];
  RecipientList: Invoice[] = [];
  RecipientNameInput: boolean = false
  SubLedgerList: SubLedger[] = [];
  UnitList: Unit[] = [];
  VendorList: Vendor[] = [];
  VendorServiceList: ServiceSuppliedByVendorProps[] = [];
  VendorServiceListByVendor: VendorService[] = [];
  isDieselPaid: boolean = false
  RecipientNameReadOnly: boolean = false
  ExpenseTypeList = DomainEnums.ExpenseTypeList();
  LabourTypeList = DomainEnums.LabourTypesList();
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Bill' | 'Edit Bill' = 'New Bill';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Invoice = null as any;
  LedgerList: Ledger[] = [];
  strCDT: string = ''
  DisplayTotalWorkingHrs: string = ''

  MachinaryExpenseRef: number = ExpenseTypes.MachinaryExpense
  LabourExpenseRef: number = ExpenseTypes.LabourExpense
  OtherExpenseRef: number = ExpenseTypes.OtherExpense
  TimeUnitRef: number = UnitRefs.TimeUnitRef

  MachineTimeEntity: TimeDetailProps = TimeDetailProps.Blank();
  MachineEditingIndex: null | undefined | number
  isTimeModalOpen: boolean = false;

  LabourTimeEntity: LabourTimeProps = LabourTimeProps.Blank();
  LabourEditingIndex: null | undefined | number
  isLabourTimeModalOpen: boolean = false;
  Bill = ModeOfPayments.Bill
  TypeRecipient = RecipientTypes.Recipient
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref == this.Bill);
  RecipientTypesList = DomainEnums.RecipientTypesList();

  companyRef = this.companystatemanagement.SelectedCompanyRef;
  timeheaders: string[] = ['Sr.No.', 'Start Time ', 'End Time', 'Worked Hours', 'Action'];
  labourtimeheaders: string[] = ['Sr.No.', 'Labour Type', 'From Time', 'To Time', 'Quantity ', 'Rate', 'Amount', 'Action'];
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  // @ViewChild('invoiceForm') invoiceForm!: NgForm;
  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('DescriptionCtrl') DescriptionCtrlInputControl!: NgModel;
  @ViewChild('RecipientNameCtrl') RecipientNameInputControl!: NgModel;
  @ViewChild('QtyCtrl') QtyInputControl!: NgModel;
  @ViewChild('RateCtrl') RateInputControl!: NgModel;
  @ViewChild('DieselQtyCtrl') DieselQtyInputControl!: NgModel;
  @ViewChild('DieselRateCtrl') DieselRateInputControl!: NgModel;
  @ViewChild('StartTimeCtrl') StartTimeInputControl!: NgModel;
  @ViewChild('EndTimeCtrl') EndTimeInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
  ) { }

  async ngOnInit() {
    await this.appStateManage.setDropdownDisabled(true);
    await this.getVendorListByCompanyRef();
    this.getSiteListByCompanyRef()
    this.getLedgerListByCompanyRef()
    await this.getUnitList()
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Bill' : 'Edit Bill';
      this.Entity = Invoice.GetCurrentInstance();
      console.log('this.Entity :', this.Entity);
      this.Entity.p.RecipientType =   this.Entity.p.InvoiceRecipientType;
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.Entity.p.LedgerRef) {
        await this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef)
      }
      if (this.Entity.p.Date != '') {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
      }
      if (this.Entity.p.IsDieselPaid == 1) {
        this.isDieselPaid = true
      }
      this.getVendorServiceListByVendorRef(this.Entity.p.VendorRef);
      this.getTotalWorkedHours();
      // this.RecipientNameReadOnly = true
    } else {
      this.Entity = Invoice.CreateNewInstance();
      Invoice.SetCurrentInstance(this.Entity);
      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = this.strCDT.substring(0, 16).split('-');
      this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      await this.getChalanNo()
    }
    // this.getRecipientListByCompanyRef()
    if (this.Entity.p.RecipientType != 0) {
      this.getRecipientListByRecipientTypeRef()
    }
    this.InitialEntity = Object.assign(
      Invoice.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Invoice;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('SiteRef')!;
    txtName.focus();
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.VendorList = []
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
  }

  private FormulateVendorServiceList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.VendorServiceListByVendor = []
    let lst = await VendorService.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.VendorServiceListByVendor = lst;
  };

  getVendorServiceListByVendorRef = async (VendorRef: number) => {
    if (this.IsNewEntity) {
      this.Entity.p.VendorServiceRef = 0
    }
    this.VendorServiceList = []
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (VendorRef <= 0) {
      return;
    }
    let lst = await Vendor.FetchInstance(VendorRef, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst.p.ServiceListSuppliedByVendor;
    this.VendorServiceListByVendor = []; // Clear existing list first
    if (this.VendorServiceList.length > 0) {
      await this.FormulateVendorServiceList();
      const refArray = this.VendorServiceList.map(s => Number(s));
      const matched = this.VendorServiceListByVendor.filter(service => refArray.includes(service.p.Ref));
      this.VendorServiceListByVendor = matched; // Either matched list or stays empty
    }
  }

  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UnitList = lst;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  // getRecipientListByCompanyRef = async () => {
  //   if (this.companyRef() <= 0) {
  //     await this.uiUtils.showErrorToster('Company not Selected');
  //     return;
  //   }
  //   let lst = await Recipient.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.RecipientList = lst;
  // }

  getRecipientListByRecipientTypeRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      await this.uiUtils.showErrorToster('To Whom not Selected');
      return;
    }

    if (this.Entity.p.ExpenseType != ExpenseTypes.OtherExpense) {
      return;
    }

    this.RecipientList = [];
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(this.companyRef(), this.Entity.p.RecipientType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.RecipientList = lst;
  }

  AddRecipientName = () => {
    this.Entity.p.RecipientMasterRef = 0
    this.RecipientEntity.p.Name = ''
    this.RecipientNameInput = true
  }

  cancelRecipientName = () => {
    this.RecipientNameInput = false
    this.RecipientEntity.p.Name = ''
  }

  onTypeChange = async () => {
    this.Entity.p.RecipientMasterRef = 0;
    this.RecipientNameInput = false
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubLedgerList = lst;
  }

  OnLedgerChange = () => {
    this.Entity.p.SubLedgerRef = 0
  }

  DiselPaid = (DiselPaid: number) => {
    if (DiselPaid == 1) {
      this.isDieselPaid = true
      this.Entity.p.IsDieselPaid = 1;
    } else {
      this.Entity.p.DieselQty = 0;
      this.Entity.p.DieselRate = 0;
      this.Entity.p.DieselAmount = 0;
      this.Entity.p.IsDieselPaid = 0;
      this.isDieselPaid = false
    }
    this.CalculateAmount()
  }

  CalculateDieselAmount = () => {
    const DieselQty = Number(this.Entity.p.DieselQty)
    const DieselRate = Number(this.Entity.p.DieselRate)
    this.Entity.p.DieselAmount = Math.round(DieselQty * DieselRate * 100) / 100;
    this.CalculateAmount()
  }

  CalculateAmount = () => {
    const TotalWorkedHours = this.getTotalWorkedHours()
    const TotalLabourAmount = this.getTotalLabourAmount()
    const Qty = Number(this.Entity.p.Qty)
    const DieselAmount = Number(this.Entity.p.DieselAmount) || 0
    // debugger
    if (TotalWorkedHours > 0) {
      const Rate = Number(this.Entity.p.Rate / 60);
      this.Entity.p.InvoiceAmount = Math.round(((TotalWorkedHours * Rate) - DieselAmount) * 100) / 100;
    } else if (TotalLabourAmount > 0) {
      this.Entity.p.InvoiceAmount = Math.round((TotalLabourAmount) * 100) / 100;
    } else {
      this.Entity.p.InvoiceAmount = Math.round(((Qty * this.Entity.p.Rate) - DieselAmount) * 100) / 100;
    }
  }

  getChalanNo = async () => {
    let req = new InvoiceNoFetchRequest();
    req.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
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
          this.Entity.p.InvoiceNo = NextInvoiceNo
          return;
        }
      }
    }
    await this.uiUtils.showErrorMessage('Error', 'Chalan number could not be retrieved.');
  };

  getTotalWorkedHours(): number {
    let total = this.Entity.p.MachineUsageDetailsArray.reduce((total: number, item: any) => {
      return total + Number(item.WorkedHours || 0);
    }, 0);
    this.DisplayTotalWorkingHrs = this.formatMinutesToHourMin(total);
    return total;
  }

  formatMinutesToHourMin = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}h ${formattedMinutes}m`;
  }

  getTotalLabourAmount(): number {
    return this.Entity.p.LabourExpenseDetailsArray.reduce((total: number, item: any) => {
      return total + Number(item.LabourAmount || 0);
    }, 0);
  }

  convertFractionTimeToHM = (fractionTime: number) => {
    const hours = Math.floor(fractionTime);
    const fractionalMinutes = fractionTime - hours;

    // Convert fractional part (base 100) to minutes (base 60)
    const minutes = Math.round(fractionalMinutes * 100 * 60 / 100);

    // Pad minutes with leading zero if needed
    const paddedMinutes = String(minutes).padStart(2, '0');

    return `${hours}h ${paddedMinutes}m`;
  }

  calculateWorkedHours() {
    // const start = this.MachineTimeEntity.StartTime;
    // const end = this.MachineTimeEntity.EndTime;

    // if (start && end) {
    //   const [startHour, startMin] = start.split(':').map(Number);
    //   const [endHour, endMin] = end.split(':').map(Number);

    //   const startDate = new Date();
    //   startDate.setHours(startHour, startMin, 0);

    //   const endDate = new Date();
    //   endDate.setHours(endHour, endMin, 0);

    //   let diffMs = endDate.getTime() - startDate.getTime();

    //   // If end time is before start time, assume it's the next day
    //   if (diffMs < 0) {
    //     endDate.setDate(endDate.getDate() + 1);
    //     diffMs = endDate.getTime() - startDate.getTime();
    //   }

    //   const diffHrs = diffMs / (1000 * 60 * 60); // convert ms to hours
    //   this.MachineTimeEntity.WorkedHours = +diffHrs.toFixed(2); // round to 2 decimal places
    // } else {
    //   this.MachineTimeEntity.WorkedHours = 0;
    // }

    // if (this.MachineTimeEntity.StartTime == '') {
    //   return
    // }

    // if (this.MachineTimeEntity.EndTime == '') {
    //   return
    // }

    // // Fallback to "00:00" if either is missing or invalid
    // if (!this.MachineTimeEntity.StartTime || !this.MachineTimeEntity.StartTime.includes(":")) return 0;

    // const [inHour, inMin] = this.MachineTimeEntity.StartTime.split(':').map(Number);
    // const [outHour, outMin] = (this.MachineTimeEntity.EndTime && this.MachineTimeEntity.EndTime.includes(":") ? this.MachineTimeEntity.EndTime : "00:00").split(':').map(Number);

    // // Check for invalid numbers
    // if (isNaN(inHour) || isNaN(inMin) || isNaN(outHour) || isNaN(outMin)) return 0;

    // const inDate = new Date();
    // inDate.setHours(inHour, inMin, 0, 0);

    // const outDate = new Date();
    // outDate.setHours(outHour, outMin, 0, 0);

    // // Handle overnight shift
    // if (outDate <= inDate) {
    //   outDate.setDate(outDate.getDate() + 1);
    // }

    // const diffMs = outDate.getTime() - inDate.getTime();
    // const diffMinutes = Math.floor(diffMs / 60000);

    // const decimalHours = diffMinutes / 60;

    // this.MachineTimeEntity.WorkedHours = parseFloat(decimalHours.toFixed(2));


    if (this.MachineTimeEntity.StartTime == '') return;
    if (this.MachineTimeEntity.EndTime == '') return;

    // Fallback to "00:00" if either is missing or invalid
    if (!this.MachineTimeEntity.StartTime || !this.MachineTimeEntity.StartTime.includes(":")) return 0;

    const [inHour, inMin] = this.MachineTimeEntity.StartTime.split(':').map(Number);
    const [outHour, outMin] = (
      this.MachineTimeEntity.EndTime && this.MachineTimeEntity.EndTime.includes(":")
        ? this.MachineTimeEntity.EndTime
        : "00:00"
    ).split(':').map(Number);

    // Check for invalid numbers
    if (isNaN(inHour) || isNaN(inMin) || isNaN(outHour) || isNaN(outMin)) return 0;

    const inDate = new Date();
    inDate.setHours(inHour, inMin, 0, 0);

    const outDate = new Date();
    outDate.setHours(outHour, outMin, 0, 0);

    // Handle overnight shift
    if (outDate <= inDate) {
      outDate.setDate(outDate.getDate() + 1);
    }

    const diffMs = outDate.getTime() - inDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);  // 💡 Minutes difference

    // 🔁 Assign minutes directly instead of decimal hours
    this.MachineTimeEntity.WorkedHours = diffMinutes;

    // HH:mm format
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    this.MachineTimeEntity.DisplayWorkedHours = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    return;
  }

  async SaveTime() {
    if (!this.MachineTimeEntity.StartTime || !this.MachineTimeEntity.EndTime) {
      await this.uiUtils.showErrorMessage('Error', 'Start Time and End Time are required!');
      return;
    }

    if (this.MachineEditingIndex !== null && this.MachineEditingIndex !== undefined && this.MachineEditingIndex >= 0) {
      this.Entity.p.MachineUsageDetailsArray[this.MachineEditingIndex] = { ...this.MachineTimeEntity };
      await this.uiUtils.showSuccessToster('Machinary Time updated successfully');
      this.isTimeModalOpen = false;
    } else {
      this.MachineTimeEntity.InvoiceRef = this.Entity.p.Ref;
      this.Entity.p.MachineUsageDetailsArray.push({ ...this.MachineTimeEntity });
      await this.uiUtils.showSuccessToster('Machinary Time added successfully');
      this.resetTimeControls();
      this.isTimeModalOpen = false;
    }

    this.MachineTimeEntity = TimeDetailProps.Blank();
    this.MachineEditingIndex = null;
    this.CalculateAmount()
  }

  EditTime(index: number) {
    this.isTimeModalOpen = true
    this.MachineTimeEntity = { ...this.Entity.p.MachineUsageDetailsArray[index] }
    this.MachineEditingIndex = index;
  }

  RemoveTime(index: number) {
    this.Entity.p.MachineUsageDetailsArray.splice(index, 1); // Remove Time
    this.CalculateAmount()
  }

  CloseTimeModal = async (type: string) => {
    if (type === 'machinetime') {
      const keysToCheck = ['StartTime', 'EndTime'] as const;

      const hasData = keysToCheck.some(
        key => (this.MachineTimeEntity as any)[key]?.toString().trim()
      );

      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
               Are you sure you want to close this modal?`,
          async () => {
            this.isTimeModalOpen = false;
            this.MachineTimeEntity = TimeDetailProps.Blank();
          }
        );
      } else {
        this.isTimeModalOpen = false;
        this.MachineTimeEntity = TimeDetailProps.Blank();
      }
    }
  };

  async SaveLabourTime() {
    if (!this.LabourTimeEntity.LabourFromTime) {
      await this.uiUtils.showErrorMessage('Error', 'From Time is required!');
      return;
    } else if (!this.LabourTimeEntity.LabourToTime) {
      await this.uiUtils.showErrorMessage('Error', 'To Time is required!');
      return;
    } else if (!this.LabourTimeEntity.LabourType) {
      await this.uiUtils.showErrorMessage('Error', 'Labour Type is required!');
      return;
    }
    if (this.LabourTimeEntity.LabourType != 0) {
      const labourtype = this.LabourTypeList.find(item => item.Ref == this.LabourTimeEntity.LabourType)
      this.LabourTimeEntity.LabourTypeName = labourtype?.Name || ''
    }
    if (this.LabourEditingIndex !== null && this.LabourEditingIndex !== undefined && this.LabourEditingIndex >= 0) {
      this.Entity.p.LabourExpenseDetailsArray[this.LabourEditingIndex] = { ...this.LabourTimeEntity };
      await this.uiUtils.showSuccessToster('Labour Time updated successfully');
      this.isLabourTimeModalOpen = false;
    } else {
      this.LabourTimeEntity.InvoiceRef = this.Entity.p.Ref;
      this.Entity.p.LabourExpenseDetailsArray.push({ ...this.LabourTimeEntity });
      await this.uiUtils.showSuccessToster('Labour Time added successfully');
      // this.resetTimeControls();
      this.isLabourTimeModalOpen = false;
    }
    this.LabourTimeEntity = LabourTimeProps.Blank();
    this.LabourEditingIndex = null;
    this.CalculateAmount()
  }

  EditLabourTime(index: number) {
    this.isLabourTimeModalOpen = true
    this.LabourTimeEntity = { ...this.Entity.p.LabourExpenseDetailsArray[index] }
    this.LabourEditingIndex = index;
  }

  RemoveLabourTime(index: number) {
    this.Entity.p.LabourExpenseDetailsArray.splice(index, 1); // Remove Time
    this.CalculateAmount()
  }

  CloseLabourTimeModal = async (type: string) => {
    if (type === 'labourtime') {
      const keysToCheck = ['LabourType', 'LabourFromTime', 'LabourToTime', 'LabourQty', 'LabourRate'] as const;

      const hasData = keysToCheck.some(
        key => (this.LabourTimeEntity as any)[key]?.toString().trim()
      );

      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
               Are you sure you want to close this modal?`,
          async () => {
            this.isLabourTimeModalOpen = false;
            this.LabourTimeEntity = LabourTimeProps.Blank();
          }
        );
      } else {
        this.isLabourTimeModalOpen = false;
        this.LabourTimeEntity = LabourTimeProps.Blank();
      }
    }
  };

  ClearInputsOnExpenseChange = () => {
    this.Entity.p.MachineUsageDetailsArray = []
    this.Entity.p.LabourExpenseDetailsArray = []
    this.Entity.p.RecipientType = 0
    this.Entity.p.RecipientMasterRef = 0
    this.RecipientNameInput = false
    this.Entity.p.VendorRef = 0
    this.Entity.p.VendorServiceRef = 0
    this.Entity.p.VehicleNo = ''
    this.Entity.p.Qty = 0
    this.Entity.p.Rate = 0
    this.CalculateAmount()
    this.DiselPaid(0)
  }

  ClearMachineTimeTable = () => {
    this.Entity.p.MachineUsageDetailsArray = []
  }

  ClearInputsOnLabourType = () => {
    this.LabourTimeEntity.LabourQty = 0
    this.LabourTimeEntity.LabourRate = 0
    this.LabourTimeEntity.LabourAmount = 0
    this.LabourTimeEntity.LabourFromTime = ''
    this.LabourTimeEntity.LabourToTime = ''
  }

  CalculateLabourAmount = () => {
    const Qty = this.LabourTimeEntity.LabourQty
    const Rate = this.LabourTimeEntity.LabourRate
    this.LabourTimeEntity.LabourAmount = Math.round(Qty * Rate * 100) / 100;

  }

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveNewRecipientName = async () => {
    if (this.RecipientEntity.p.Name == '') {
      this.uiUtils.showErrorToster('Recipient Name can not be Blank');
      return
    }
    this.RecipientEntity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.RecipientEntity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.RecipientEntity.p.CreatedBy == 0) {
      this.RecipientEntity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.RecipientEntity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.RecipientEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      await this.uiUtils.showSuccessToster('Recipient Name saved successfully');
      this.RecipientNameInput = false
      this.RecipientEntity = Recipient.CreateNewInstance();
      // await this.getRecipientListByCompanyRef()
      await this.getRecipientListByRecipientTypeRef()
    }
  };

  SaveInvoiceMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    if (this.Entity.p.InvoiceAmount < 0) {
      await this.uiUtils.showErrorMessage('Error', 'Bill amount should be greater than zero.');
      return;
    }
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Bill saved successfully');
        this.Entity = Invoice.CreateNewInstance();
        this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        let parts = this.strCDT.substring(0, 16).split('-');
        this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        await this.resetAllControls();
        this.isDieselPaid = false
      } else {
        await this.uiUtils.showSuccessToster('Bill Updated successfully');
        await this.router.navigate(['/homepage/Website/Billing']);
      }
    }
  };

  BackInvoice = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Billing Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Billing']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Billing']);
    }
  }

  resetAllControls = async () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.DateInputControl.control.markAsUntouched();
    this.DescriptionCtrlInputControl.control.markAsUntouched();
    this.RecipientNameInputControl.control.markAsUntouched();
    this.QtyInputControl.control.markAsUntouched();
    this.RateInputControl.control.markAsUntouched();
    this.DieselQtyInputControl.control.markAsUntouched();
    this.DieselRateInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
    this.DateInputControl.control.markAsPristine();
    this.DescriptionCtrlInputControl.control.markAsPristine();
    this.RecipientNameInputControl.control.markAsPristine();
    this.QtyInputControl.control.markAsPristine();
    this.RateInputControl.control.markAsPristine();
    this.DieselQtyInputControl.control.markAsPristine();
    this.DieselRateInputControl.control.markAsPristine();
  }

  resetTimeControls = () => {
    this.StartTimeInputControl.control.markAsUntouched();
    this.EndTimeInputControl.control.markAsUntouched();

    this.StartTimeInputControl.control.markAsPristine();
    this.EndTimeInputControl.control.markAsPristine();
  }
}

