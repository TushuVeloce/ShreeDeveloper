import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseTypeRefs, UnitRefs, ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums, StageType } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { ServiceSuppliedByVendorProps, Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { ActualStagesChalanFetchRequest } from 'src/app/classes/domain/entities/website/site_management/actualstagechalan/actualstagechalanfetchrequest';
import { ActualStages, ActualStagesProps } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { Time, TimeDetailProps } from 'src/app/classes/domain/entities/website/site_management/time/time';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { DTU } from 'src/app/services/dtu.service';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';

@Component({
  selector: 'app-site-management-actual-stages-details',
  templateUrl: './site-management-actual-stages-details.component.html',
  standalone: false,
  styleUrls: ['./site-management-actual-stages-details.component.scss'],
})
export class SiteManagementActualStagesDetailsComponent implements OnInit {

  Entity: ActualStages = ActualStages.CreateNewInstance();
  ExpenseTypeEntity: ExpenseType = ExpenseType.CreateNewInstance();
  VendorServicesEntity: Vendor = Vendor.CreateNewInstance();
  private IsNewEntity: boolean = true;
  DetailsFormTitle: 'New Actual Stage' | 'Edit Actual Stage' = 'New Actual Stage';
  InitialEntity: ActualStages = null as any;
  isSaveDisabled: boolean = false;
  VendorList: Vendor[] = [];
  VendorServiceList: ServiceSuppliedByVendorProps[] = [];
  VendorServiceListByVendor: VendorService[] = [];
  StageList: Stage[] = [];
  SiteList: Site[] = [];
  SubStageList: SubStage[] = [];
  ExpenseTypeList: ExpenseType[] = [];
  UnitList: Unit[] = [];
  StageType: number = 0;
  IsStage: Boolean = false;
  StageTypeList = DomainEnums.StageTypeList(true, 'select stage');
  MonthList = DomainEnums.MonthList(true, '--Select Month Type--');
  GutterNaleUnitList = DomainEnums.UnitList(true, '--Select Unit--');
  StageTypeEnum = StageType;
  UnitQuantityTotal: number = 0;
  isAddingExpense = false;
  isAdd = false;
  // isOfficialExpenditureGov = false
  isModalOpen: boolean = false;
  timeheaders: string[] = ['Sr.No.', 'Start Time ', 'End Time', 'Worked Hours', 'Action'];
  TimeEntity: TimeDetailProps = TimeDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  isChalanDisabled = false
  originalAmount: number = 0;
  strCDT: string = ''
  ExpenseTypeRef: number = ExpenseTypeRefs.MachinaryExpense
  LabourExpenseRef: number = ExpenseTypeRefs.LabourExpense
  OtherExpenseRef: number = ExpenseTypeRefs.OtherExpense
  TimeUnitRef: number = UnitRefs.TimeUnitRef
  isDiselPaid: boolean = false

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg


  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('ChalanNoCtrl') ChalanNoInputControl!: NgModel;
  @ViewChild('RateCtrl') RateInputControl!: NgModel;
  @ViewChild('VehicleNoCtrl') VehicleNoInputControl!: NgModel;
  @ViewChild('StartTimeCtrl') StartTimeInputControl!: NgModel;
  @ViewChild('EndTimeCtrl') EndTimeInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService, private dtu: DTU,) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.getStageListByCompanyRef();
    await this.getVendorListByCompanyRef();
    await this.FormulateUnitList();
    await this.getSiteListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Actual Stage' : 'Edit Actual Stage';
      this.Entity = ActualStages.GetCurrentInstance();
      if (this.Entity.p.Date != '') {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
      }
      this.isChalanDisabled = true
      if (this.Entity.p.TimeDetails.length > 0) {
        this.Entity.p.Amount = this.getTotalWorkedHours()
      } else {
        this.Entity.p.Amount = this.Entity.p.Rate * this.Entity.p.Quantity
      }
      if (this.Entity.p.ExpenseTypeRef == this.OtherExpenseRef) {
        this.isAddingExpense = false
        this.isAdd = true
      }
      await this.DiselPaid(this.Entity.p.IsDieselPaid)
      await this.OnStageChange(this.Entity.p.StageRef)
      this.getVendorServiceListByVendorRef(this.Entity.p.VendorRef);
      this.appStateManage.StorageKey.removeItem('Editable')
    } else {
      this.Entity = ActualStages.CreateNewInstance();
      ActualStages.SetCurrentInstance(this.Entity);
      if (this.appStateManage.StorageKey.getItem('UserDisplayName')) {
        const name = this.appStateManage.StorageKey.getItem('UserDisplayName') || ''
        this.Entity.p.CreatedByName = name
      }
      if (this.Entity.p.Date == '') {
        this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        let parts = this.strCDT.substring(0, 16).split('-');
        // Construct the new date format
        this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
      this.isChalanDisabled = false
      // if(CreatedBy != 0){
      //   this.Entity.p.CreatedBy = CreatedBy
      //   await this.getSingleEmployeeDetails(CreatedBy);
      // }
      await this.ChalanNo()
    }
    this.InitialEntity = Object.assign(ActualStages.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as ActualStages;
    this.focusInput();
  }

  focusInput = () => {
    // let txtName = document.getElementById('Name')!;
    // txtName.focus();
  }


  ChalanNo = async () => {
    let req = new ActualStagesChalanFetchRequest();
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
          item.Name === 'ActualStage' &&
          Array.isArray(item.Entries) &&
          item.Entries.length > 0
        ) {
          const entry = item.Entries[0] as { NextChalanNo: number };
          const nextChalanNo = entry.NextChalanNo;
          this.Entity.p.ChalanNo = nextChalanNo
          return;
        }
      }
    }
    await this.uiUtils.showErrorMessage('Error', 'Chalan number could not be retrieved.');
  };


  getSingleEmployeeDetails = async (CreatedBy: number) => {
    if (this.Entity.p.CreatedBy == 1001) {
      this.Entity.p.CreatedByName = 'Admin';
      return;
    }
    let data = await Employee.FetchInstance(CreatedBy, this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
  };


  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    // if (this.SiteList.length > 0) {
    //   this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
    // }
  }

  getStageListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst;
    // if (this.StageList.length > 0) {
    //   this.Entity.p.StageRef = this.StageList[0].p.Ref;
    //   this.OnStageChange( this.Entity.p.StageRef)
    //   this.StageType = this.StageList[0].p.StageType;
    //   this.IsStage = this.StageList[0].p.IsSubStageApplicable;
    // }
    this.getSubStageListByStageRef(this.Entity.p.StageRef);
    this.getExpenseListByStageRef(this.Entity.p.StageRef);
  }

  OnStageChange = async (StageRef: number) => {
    if (this.IsNewEntity) {
      this.Entity.p.ExpenseTypeRef = 0
      this.Entity.p.ExtraQuantity = 0
      this.Entity.p.GutterNaleUnitRef = 0
      await this.AddExpenseTypeToOther(this.Entity.p.ExpenseTypeRef)
    }
    let stagedata = await Stage.FetchInstance(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    // if(stagedata.p.IsOtherExpenseApplicable == true){
    //   this.isAdd = true
    // }else{
    //   this.isAdd = false
    // }
    // if(stagedata.p.StageTypeName == "Official Expenditure Gov"){
    //   this.isOfficialExpenditureGov = true
    // }else{
    //   this.isOfficialExpenditureGov = false
    // }

    await this.getSubStageListByStageRef(StageRef);
    await this.getExpenseListByStageRef(StageRef);
    await this.getStageTypeOnStageRef(StageRef);
  }


  getExpenseListByStageRef = async (StageRef: number) => {
    // if (StageRef <= 0) {
    //   await this.uiUtils.showErrorToster('Stage not Selected');
    //   return;
    // }
    this.ExpenseTypeList = []
    let lst = await ExpenseType.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ExpenseTypeList = lst;
  }

  toggleExpenseInput() {
    this.isAddingExpense = !this.isAddingExpense;
    if (!this.isAddingExpense) {
      this.ExpenseTypeEntity.p.Name = '';
    }
  }

  cancelNewExpenseType() {
    this.isAddingExpense = false;
    this.ExpenseTypeEntity.p.Name = '';
  }

  getSubStageListByStageRef = async (StageRef: number) => {
    // if (StageRef <= 0) {
    //   await this.uiUtils.showErrorToster('Stage not Selected');
    //   return;
    // }
    if (this.IsNewEntity) {
      this.Entity.p.SubStageRef = 0
    }
    let lst = await SubStage.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubStageList = lst;
  }


  getStageTypeOnStageRef = async (StageRef: number) => {
    // if (this.Entity.p.StageRef <= 0) {
    //   await this.uiUtils.showErrorToster('Stage not Selected');
    //   return;
    // }
    let SingleRecord = this.StageList.find((data) => data.p.Ref == StageRef);;
    if (SingleRecord?.p) {
      this.StageType = 0;
      this.IsStage = false;
    }
    // let SingleRecord = await Stage.FetchInstance(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    // this.StageType = SingleRecord.p.StageType;
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.VendorList = []
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
    // if (this.VendorList.length > 0) {
    //   this.Entity.p.VendorRef = this.VendorList[0].p.Ref;
    // }
    // this.getVendorServiceListByVendorRef();
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

  FormulateUnitList = async () => {
    let lst = await Unit.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.UnitList = lst;
  };

  ClearInputsOnExpenseChange = (ExpenseTypeRef: number) => {
    this.AddExpenseTypeToOther(ExpenseTypeRef)
    this.Entity.p.GrandTotal = 0;
    this.Entity.p.UnitRef = 0;
    this.Entity.p.Quantity = 0;
    this.Entity.p.Rate = 0;
    this.Entity.p.Amount = 0;
    if (this.Entity.p.ExpenseTypeRef == this.ExpenseTypeRef) {
      this.Entity.p.SkillRate = 0;
      this.Entity.p.SkillQuantity = 0;
      this.Entity.p.SkillAmount = 0;

      this.Entity.p.UnskillRate = 0;
      this.Entity.p.UnskillQuantity = 0;
      this.Entity.p.UnskillAmount = 0;

      this.Entity.p.LadiesRate = 0;
      this.Entity.p.LadiesQuantity = 0;
      this.Entity.p.LadiesAmount = 0;
    }

    if (this.Entity.p.ExpenseTypeRef == this.LabourExpenseRef) {
      this.Entity.p.DieselRate = 0;
      this.Entity.p.DieselQuantity = 0;
      this.Entity.p.DieselTotalAmount = 0;
      this.Entity.p.IsDieselPaid = 0;
      this.Entity.p.VehicleNo = '';
    }
    this.Entity.p.TimeDetails = []
  }

  ClearValuesOnTimeSelection = (UnitRef: number) => {
    this.Entity.p.TimeDetails = []
    if (UnitRef == this.TimeUnitRef) {
      this.Entity.p.Rate = 0
      this.Entity.p.Quantity = 0
      this.Entity.p.GrandTotal = 0,
        this.Entity.p.Amount = 0
    }
    this.isDiselPaid = false
    this.DiselPaid(0)

  }

  AddExpenseTypeToOther = async (ExpenseTypeRef: number) => {
    if (ExpenseTypeRef == this.OtherExpenseRef) {
      this.isAdd = true
    } else {
      this.isAdd = false
    }
  }

  CalculateTotalOnDiselRateAndLtr = () => {
    this.Entity.p.DieselTotalAmount = (this.Entity.p.DieselQuantity * this.Entity.p.DieselRate);
    this.Entity.p.GrandTotal = this.Entity.p.DieselTotalAmount + this.UnitQuantityTotal
    this.CalculateAmountOnRateAndQuantity()
  }

  CalculateAmountOnRateAndQuantity = () => {
    const TotalWorkedHours = this.getTotalWorkedHours()
    const rate = Number(this.Entity.p.Rate) || 0;
    const quantity = Number(this.Entity.p.Quantity) || 0;
    const dieselAmount = Number(this.Entity.p.DieselTotalAmount) || 0;
    const isDieselPaid = !!this.Entity.p.IsDieselPaid;

    if (TotalWorkedHours > 0) {
      this.Entity.p.GrandTotal = rate * TotalWorkedHours - dieselAmount
      this.Entity.p.Amount = rate * TotalWorkedHours
    } else {
      // this.Entity.p.Amount = rate * quantity
      // this.Entity.p.GrandTotal = rate * quantity - dieselAmount
      if (rate > 0 && quantity > 0) {
        this.Entity.p.Amount = rate * quantity
        this.Entity.p.GrandTotal = rate * quantity - dieselAmount
      } else {
        this.Entity.p.Amount = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
        this.Entity.p.GrandTotal = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
      }
    }
  };


  CalculateAmountOnSkillRateAndQuantity = () => {
    this.Entity.p.SkillAmount = (this.Entity.p.SkillRate * this.Entity.p.SkillQuantity);
    this.Entity.p.GrandTotal = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
  }

  CalculateAmountOnUnSkillRateAndQuantity = () => {
    this.Entity.p.UnskillAmount = (this.Entity.p.UnskillRate * this.Entity.p.UnskillQuantity);
    this.Entity.p.GrandTotal = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
  }

  CalculateAmountOnLadiesRateAndQuantity = () => {
    this.Entity.p.LadiesAmount = (this.Entity.p.LadiesRate * this.Entity.p.LadiesQuantity);
    this.Entity.p.GrandTotal = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
  }

  calculateWorkedHours() {
    const start = this.TimeEntity.StartTime;
    const end = this.TimeEntity.EndTime;

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

      const diffHrs = diffMs / (1000 * 60 * 60); // convert ms to hours
      this.TimeEntity.WorkedHours = +diffHrs.toFixed(2); // round to 2 decimal places
    } else {
      this.TimeEntity.WorkedHours = 0;
    }
  }

  DiselPaid = (DiselPaid: number) => {
    if (DiselPaid == 1) {
      this.isDiselPaid = true
      this.Entity.p.IsDieselPaid = 1;
    } else {
      this.Entity.p.DieselQuantity = 0;
      this.Entity.p.DieselRate = 0;
      this.Entity.p.DieselTotalAmount = 0;
      this.Entity.p.IsDieselPaid = 0;
      this.isDiselPaid = false
    }
    this.CalculateAmountOnRateAndQuantity()
  }

  getTotalWorkedHours(): number {
    return this.Entity.p.TimeDetails.reduce((total: number, item: any) => {
      return total + Number(item.WorkedHours || 0);
    }, 0);
  }

  onSelectedMonthsChange = (Selectedservice: any) => {
    this.Entity.p.SelectedMonths = Selectedservice;
  }


  saveNewExpenseType = async () => {
    this.ExpenseTypeEntity.p.StageRef = this.Entity.p.StageRef
    let entityToSave = this.ExpenseTypeEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    await this.ExpenseTypeEntity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      await this.uiUtils.showSuccessToster('Expense Type saved successfully');
      this.ExpenseTypeEntity = ExpenseType.CreateNewInstance();
      this.ExpenseTypeEntity.p.Name = ''
      this.isAddingExpense = false
      this.getExpenseListByStageRef(this.Entity.p.StageRef)

    }
  }

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  async SaveTime() {
    if (!this.TimeEntity.StartTime || !this.TimeEntity.EndTime) {
      await this.uiUtils.showErrorMessage('Error', 'Start Time and End Time are required!');
      return;
    }

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.TimeDetails[this.editingIndex] = { ...this.TimeEntity };
      await this.uiUtils.showSuccessToster('Machinary Time updated successfully');
      this.isModalOpen = false;
    } else {
      this.TimeEntity.SiteManagementRef = this.Entity.p.Ref;
      this.Entity.p.TimeDetails.push({ ...this.TimeEntity });
      this.CalculateAmountOnRateAndQuantity()
      await this.uiUtils.showSuccessToster('Machinary Time added successfully');
      this.resetTimeControls();
    }

    this.TimeEntity = TimeDetailProps.Blank();
    this.editingIndex = null;
  }


  EditTime(index: number) {
    this.isModalOpen = true
    this.TimeEntity = { ...this.Entity.p.TimeDetails[index] }
    this.editingIndex = index;
  }


  RemoveTime(index: number) {
    this.Entity.p.TimeDetails.splice(index, 1); // Remove Time
    this.CalculateAmountOnRateAndQuantity()
  }

  closeModal = async (type: string) => {
    if (type === 'time') {
      const keysToCheck = ['Start Time', 'End Time'] as const;

      const hasData = keysToCheck.some(
        key => (this.TimeEntity as any)[key]?.toString().trim()
      );

      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
             Are you sure you want to close this modal?`,
          async () => {
            this.isModalOpen = false;
            this.TimeEntity = TimeDetailProps.Blank();
          }
        );
      } else {
        this.isModalOpen = false;
        this.TimeEntity = TimeDetailProps.Blank();
      }
    }
  };


  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.VehicleNoInputControl.control.markAsUntouched();
    this.ChalanNoInputControl.control.markAsUntouched();
    this.RateInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
    this.ChalanNoInputControl.control.markAsPristine();
    this.RateInputControl.control.markAsPristine();
  }

  resetTimeControls = () => {
    this.StartTimeInputControl.control.markAsUntouched();
    this.EndTimeInputControl.control.markAsUntouched();

    this.StartTimeInputControl.control.markAsPristine();
    this.EndTimeInputControl.control.markAsPristine();
  }

  SaveActualStage = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
    this.Entity.p.Total = this.getTotalWorkedHours()
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Actual Stage saved successfully');
        this.Entity = ActualStages.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Actual Stage Updated successfully');
        await this.router.navigate(['/homepage/Website/Actual_Stage']);
      }
    }
  }

  BackActualStages = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Actual Stage Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Actual_Stage']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Actual_Stage']);
    }
  }
}

