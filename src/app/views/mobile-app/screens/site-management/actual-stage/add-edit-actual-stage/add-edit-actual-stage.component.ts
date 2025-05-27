import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseTypeRefs, UnitRefs } from 'src/app/classes/domain/constants';
import { DomainEnums, StageType } from 'src/app/classes/domain/domainenums/domainenums';
import { ServiceSuppliedByVendorProps } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { ActualStagesChalanFetchRequest } from 'src/app/classes/domain/entities/website/site_management/actualstagechalan/actualstagechalanfetchrequest';
import { ActualStages } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { Time, TimeDetailProps } from 'src/app/classes/domain/entities/website/site_management/time/time';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-edit-actual-stage',
  templateUrl: './add-edit-actual-stage.component.html',
  styleUrls: ['./add-edit-actual-stage.component.scss'],
  standalone: false
})
export class AddEditActualStageComponent implements OnInit {
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  Entity: ActualStages = ActualStages.CreateNewInstance();
  ExpenseTypeEntity: ExpenseType = ExpenseType.CreateNewInstance();
  VendorServicesEntity: Vendor = Vendor.CreateNewInstance();
  IsNewEntity: boolean = true;
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
  StageTypeList = DomainEnums.StageTypeList();
  MonthList = DomainEnums.MonthList();
  GutterNaleUnitList = DomainEnums.UnitList();
  StageTypeEnum = StageType;
  UnitQuantityTotal: number = 0;
  isAddingExpense = false;
  isAdd = false;
  isOfficialExpenditureGov = false
  // isModalOpen: boolean = false;
  timeheaders: string[] = ['Sr.No.', 'Start Time ', 'End Time', 'Worked Hours', 'Action'];
  TimeEntity: TimeDetailProps = TimeDetailProps.Blank();
  editingIndex: null | undefined | number
  isChalanDisabled = false
  Amount: number = 0
  originalAmount: number = 0;
  strCDT: string = ''
  MachinaryExpenseTypeRef: number = ExpenseTypeRefs.MachinaryExpense
  LabourExpenseRef: number = ExpenseTypeRefs.LabourExpense
  OtherExpenseRef: number = ExpenseTypeRefs.OtherExpense
  TimeUnitRef: number = UnitRefs.TimeUnitRef
  isDiselPaid: boolean = false

  companyRef: number = 0;
  companyName: any = '';
  siteRef: number = 0;
  siteName: string | null = '';
  selectedSite: any[] = [];
  selectedStage: any[] = [];
  selectedExpenseType: any[] = [];
  selectedVendor: any[] = [];
  selectedVendorService: any[] = [];
  selectedSubStage: any[] = [];
  selectedUnit: any[] = [];
  // selectedMonths: any[] = [];
  selectedGutterNaleUnit: any[] = [];

  Date: string | null = null;
  StartTime: string | null = null;
  EndTime: string | null = null;
  SelectedMonth: any[] = [];
  selectedItems: any[] = [];

  constructor(private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private appStateManagement: AppStateManageService,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService, private dtu: DTU
  ) { }

  async ngOnInit(): Promise<void> {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
    await this.loadCustomerEnquiryIfEmployeeExists();
  }

  // ionViewWillEnter = async () => {
  //   await this.loadSalarySlipRequestsIfEmployeeExists();
  // };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  closeModal() {
    this.isModalOpen = false;
  }
  openModel() {
    this.TimeEntity = TimeDetailProps.Blank();
    this.StartTime = null;
    this.EndTime = null;
    this.editingIndex = null;
    this.isModalOpen = true;
  }
  DateChange(value: string) {
    this.Date = value;
    console.log('value :', value);
    this.Entity.p.Date = value || '';
  }

  // ---------- UTILITY METHODS ----------

  formatTimeToHHMM(isoString: string): string {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  formatToTrimmedISOString(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  convertHHMMToISOString(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return this.formatToTrimmedISOString(now.toISOString());
  }
 
  // ---------- TIME CHANGE EVENTS ----------

  StartTimeChange(value: string) {
    this.StartTime = value;
    this.TimeEntity.StartTime = this.formatTimeToHHMM(value);
    this.calculateWorkedHours();
  }

  EndTimeChange(value: string) {
    if (!this.StartTime) {
      const now = new Date();
      this.StartTimeChange(this.formatToTrimmedISOString(now.toISOString()));
    }
    this.EndTime = value;
    this.TimeEntity.EndTime = this.formatTimeToHHMM(value);
    this.calculateWorkedHours();
  }

  // ---------- WORKED HOURS CALCULATION ----------

  calculateWorkedHours() {
    const { StartTime, EndTime } = this.TimeEntity;

    if (StartTime && EndTime) {
      const [startHour, startMin] = StartTime.split(':').map(Number);
      const [endHour, endMin] = EndTime.split(':').map(Number);

      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);

      startDate.setHours(startHour, startMin, 0, 0);
      endDate.setHours(endHour, endMin, 0, 0);

      // Handle next-day time difference
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const diffMs = endDate.getTime() - startDate.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);

      this.TimeEntity.WorkedHours = +diffHrs.toFixed(2);
      // this.TotalHHMM = diffHrs.toFixed(2)+':'+diffMs.toFixed(2)
    } else {
      this.TimeEntity.WorkedHours = 0;
    }
  }

  // ---------- CRUD HANDLERS ----------

  async SaveTime() {
    if (!this.TimeEntity.StartTime || !this.TimeEntity.EndTime) {
      await this.uiUtils.showErrorMessage('Error', 'Start Time and End Time are required!');
      return;
    }

    if (this.editingIndex != null && this.editingIndex >= 0) {
      this.Entity.p.TimeDetails[this.editingIndex] = { ...this.TimeEntity };
      await this.uiUtils.showSuccessToster('Time updated successfully!');
    } else {
      this.TimeEntity.SiteManagementRef = this.Entity.p.Ref;
      this.Entity.p.TimeDetails.push({ ...this.TimeEntity });
      this.CalculateAmountOnRateAndQuantity();
      await this.uiUtils.showSuccessToster('Time added successfully!');
    }

    this.resetTimeEntry();
  }

  EditTime(index: number) {
    this.TimeEntity = { ...this.Entity.p.TimeDetails[index] };
    this.StartTime = this.convertHHMMToISOString(this.TimeEntity.StartTime);
    this.EndTime = this.convertHHMMToISOString(this.TimeEntity.EndTime);
    this.editingIndex = index;
    this.isModalOpen = true;
  }

  RemoveTime(index: number) {
    this.Entity.p.TimeDetails.splice(index, 1);
    this.CalculateAmountOnRateAndQuantity();
  }

  resetTimeEntry() {
    this.TimeEntity = TimeDetailProps.Blank();
    this.StartTime = null;
    this.EndTime = null;
    this.editingIndex = null;
    this.isModalOpen = false;
  }

  async closeTimeModal(type: string) {
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
            this.TimeEntity = TimeDetailProps.Blank();
            this.StartTime = null;
            this.EndTime = null;
            this.isModalOpen = false;
          }
        );
      } else {
        this.TimeEntity = TimeDetailProps.Blank();
        this.StartTime = null;
        this.EndTime = null;
        this.isModalOpen = false;
      }
    }
  }


  private async loadCustomerEnquiryIfEmployeeExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.appStateManage.setDropdownDisabled(true);
      this.siteRef = await Number(this.appStateManagement.StorageKey.getItem('siteRf'));
      this.siteName = await this.appStateManagement.StorageKey.getItem('siteName') ? this.appStateManagement.StorageKey.getItem('siteName') : '';
      // this.selectedSite = [
      //   {
      //     "p": {
      //       "Ref": this.siteRef,
      //       "Name": this.siteName ?? ''
      //     }
      //   }
      // ];
      await this.getStageListByCompanyRef();
      await this.getVendorListByCompanyRef();
      await this.FormulateUnitList();
      await this.getSiteListByCompanyRef();
      if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
        this.IsNewEntity = false;
        this.DetailsFormTitle = this.IsNewEntity ? 'New Actual Stage' : 'Edit Actual Stage';
        this.Entity = ActualStages.GetCurrentInstance();
        console.log(' this.Entity  :',  this.Entity );
        if (this.Entity.p.Date != '') {
          const datePart = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date); // e.g., "2025-05-14"
          const now = new Date();
          // Get current time parts
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          // Combine date and current time
          this.DateChange(`${datePart}T${hours}:${minutes}:${seconds}`)
        }
        
        
        this.isChalanDisabled = true
        if (this.Entity.p.TimeDetails.length > 0) {
          this.Amount = this.getTotalWorkedHours()
        } else {
          this.Amount = this.Entity.p.Rate * this.Entity.p.Quantity
        }
        await this.DiselPaid(this.Entity.p.IsDieselPaid)
        await this.OnStageChange(this.Entity.p.StageRef)
        this.getVendorServiceListByVendorRef(this.Entity.p.VendorRef);
        this.selectedStage = [{ p: { Ref: this.Entity.p.StageRef, Name: this.Entity.p.StageName } }];
        this.selectedExpenseType = [{ p: { Ref: this.Entity.p.ExpenseTypeRef, Name: this.Entity.p.ExpenseTypeName } }];
        this.selectedSubStage = [{ p: { Ref: this.Entity.p.SubStageRef, Name: this.Entity.p.SubStageName } }];
        this.selectedUnit = [{ p: { Ref: this.Entity.p.UnitRef, Name: this.Entity.p.UnitName } }];
        this.selectedGutterNaleUnit = [{ p: { Ref: this.Entity.p.GutterNaleUnitRef, Name: this.Entity.p.GutterNaleUnitName } }];
        this.selectedVendor = [{ p: { Ref: this.Entity.p.VendorRef, Name: this.Entity.p.VendorName } }];
        this.selectedVendorService = [{ p: { Ref: this.Entity.p.VendorServiceRef, Name: this.Entity.p.VendorServiceName } }];
        
        this.appStateManage.StorageKey.removeItem('Editable')
      } else {
        this.Entity = ActualStages.CreateNewInstance();
        ActualStages.SetCurrentInstance(this.Entity);
        this.Entity.p.SiteRef = this.siteRef;
        this.Entity.p.SiteName = this.siteName ?? '';
        const CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
        if (CreatedBy != 0) {
          this.Entity.p.CreatedBy = CreatedBy
          await this.getSingleEmployeeDetails();
        }
        if (this.Entity.p.Date == '') {
          this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = this.strCDT.substring(0, 16).split('-');
          // Construct the new date format
          this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
          this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        }
        this.isChalanDisabled = false
        await this.ChalanNo()
      }
      this.InitialEntity = Object.assign(ActualStages.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as ActualStages;
      // this.focusInput();
    } catch (error) {


    } finally {
      this.isLoading = false;
    }
  }

  public async selectUnitBottomsheet(): Promise<void> {
    try {
      const options = this.UnitList;
      this.openSelectModal(options, this.selectedUnit, false, 'Select Unit', 1, (selected) => {
        this.selectedUnit = selected;
        this.Entity.p.UnitName = this.selectedUnit[0].p.Name;
        this.Entity.p.UnitRef = this.selectedUnit[0].p.Ref;
        this.ClearValuesOnTimeSelection(selected[0].p.Ref);
      });
    } catch (error) {

    }
  }

  public async selectGutterNaleUnitBottomsheet(): Promise<void> {
    try {
      const options = this.GutterNaleUnitList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedGutterNaleUnit, false, 'Select Gutter Nale Unit', 1, (selected) => {
        this.selectedGutterNaleUnit = selected;
        this.Entity.p.GutterNaleUnitRef = this.selectedGutterNaleUnit[0].p.Ref;
        this.Entity.p.GutterNaleUnitName = this.selectedGutterNaleUnit[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectMonthsBottomsheet(): Promise<void> {
    try {
      const options = this.MonthList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.SelectedMonth, true, 'Select months', 12, (selected) => {
        this.SelectedMonth = selected;
        this.Entity.p.SelectedMonths = this.SelectedMonth.map(item => item.p.Ref);
        this.Entity.p.SelectedMonthsName = this.SelectedMonth.map(item => item.p.Name);
        this.onSelectedMonthsChange(this.Entity.p.SelectedMonths)
      });
    } catch (error) {

    }
  }

  public async selectSubStageBottomsheet(): Promise<void> {
    try {
      if (this.Entity.p.StageRef <= 0) {
        await this.uiUtils.showErrorToster('Please Select sub Stage');
        return;
      }
      const options = this.SubStageList;
      this.openSelectModal(options, this.selectedSubStage, false, 'Select sub Stage', 1, (selected) => {
        this.selectedSubStage = selected;
        this.Entity.p.SubStageRef = this.selectedSubStage[0].p.Ref;
        this.Entity.p.SubStageName = this.selectedSubStage[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectVendorBottomsheet(): Promise<void> {
    try {
      const options = this.VendorList;
      this.openSelectModal(options, this.selectedVendor, false, 'Select Vendor', 1, (selected) => {
        this.selectedVendor = selected;
        this.Entity.p.VendorRef = this.selectedVendor[0].p.Ref;
        this.Entity.p.VendorName = this.selectedVendor[0].p.Name;
        this.getVendorServiceListByVendorRef(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }

  public async selectVendorServicesBottomsheet(): Promise<void> {
    try {
      if (this.Entity.p.VendorRef <= 0) {
        await this.uiUtils.showErrorToster('Please Select Vendor');
        return;
      }
      // const options = this.VendorServiceList;
      const options = this.VendorServiceListByVendor;
      this.openSelectModal(options, this.selectedVendorService, false, 'Select Vendor Service', 1, (selected) => {
        this.selectedVendorService = selected;
        this.Entity.p.VendorServiceRef = this.selectedVendorService[0].p.Ref;
        this.Entity.p.VendorServiceName = this.selectedVendorService[0].p.Name;
        // this.ClearInputsOnExpenseChange();
      });
    } catch (error) {

    }
  }

  public async selectExpenseTypeBottomsheet(): Promise<void> {
    try {
      if (this.Entity.p.StageRef <= 0) {
        await this.uiUtils.showErrorToster('Please Select Stage');
        return;
      }
      const options = this.ExpenseTypeList;
      console.log('options :', options);
      this.openSelectModal(options, this.selectedExpenseType, false, 'Select Expense Type', 1, (selected) => {
        this.selectedExpenseType = selected;
        this.Entity.p.ExpenseTypeRef = this.selectedExpenseType[0].p.ExpenseType;
        this.Entity.p.ExpenseTypeName = this.selectedExpenseType[0].p.ExpenseTypeName ? selected[0].p.ExpenseTypeName : selected[0].p.Name;
        this.ClearInputsOnExpenseChange(this.Entity.p.ExpenseTypeRef);
      });
    } catch (error) {

    }
  }

  public async selectStageBottomsheet(): Promise<void> {
    try {
      const options = this.StageList;
      this.openSelectModal(options, this.selectedStage, false, 'Select Stage', 1, (selected) => {
        this.selectedStage = selected;
        this.Entity.p.StageRef = this.selectedStage[0].p.Ref;
        this.Entity.p.StageName = this.selectedStage[0].p.Name;
        this.OnStageChange(selected[0].p.Ref)
      });
    } catch (error) {

    }
  }

  public async selectSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;
        this.Entity.p.SiteRef = this.selectedSite[0].Ref;
        this.Entity.p.SiteName = this.selectedSite[0].p.Name;
      });
    } catch (error) {

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

  ChalanNo = async () => {
    try {
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
    } catch (error) {

    }
  };

  private async getSingleEmployeeDetails(): Promise<void> {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      const employee = await Employee.FetchInstance(
        this.Entity.p.CreatedBy, this.companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      if (!employee) {
        this.Entity.p.CreatedByName = this.appStateManage.StorageKey.getItem('UserDisplayName') ?? '';
      }
      this.Entity.p.CreatedByName = employee.p.Name;
    } catch (error) {

    }
  }

  getSiteListByCompanyRef = async () => {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.SiteList = lst;
    } catch (error) {

    }
  }

  getStageListByCompanyRef = async () => {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StageList = lst;
      this.getSubStageListByStageRef(this.Entity.p.StageRef);
      this.getExpenseListByStageRef(this.Entity.p.StageRef);
    } catch (error) {

    }
  }

  OnStageChange = async (StageRef: number) => {
    try {
      if (this.IsNewEntity) {
        this.Entity.p.ExpenseTypeRef = 0;
        this.Entity.p.ExpenseTypeName = '';
        this.Entity.p.ExtraQuantity=0;
        this.Entity.p.GutterNaleUnitName='';
        this.Entity.p.GutterNaleUnitRef = 0;
        this.Entity.p.SubStageName = '';
        this.Entity.p.SubStageRef =0;
        this.Entity.p.SelectedMonthsName = [];
        this.Entity.p.SelectedMonths = [];
        await this.AddExpenseTypeToOther(this.Entity.p.ExpenseTypeRef)
      }
      // let stagedata = await Stage.FetchInstance(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      // if (stagedata.p.StageTypeName == "Official Expenditure Gov") {
      //   this.isOfficialExpenditureGov = true
      // } else {
      //   this.isOfficialExpenditureGov = false
      // }

      await this.getSubStageListByStageRef(StageRef);
      await this.getExpenseListByStageRef(StageRef);
      await this.getStageTypeOnStageRef(StageRef);
    } catch (error) {

    }
  }

  getExpenseListByStageRef = async (StageRef: number) => {
    try {
      this.ExpenseTypeList = []
      let lst = await ExpenseType.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.ExpenseTypeList = lst;
    } catch (error) {

    }
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
    try {
      let lst = await SubStage.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.SubStageList = lst;
    } catch (error) {

    }
  }

  getStageTypeOnStageRef = async (StageRef: number) => {
    try {
      let SingleRecord = this.StageList.find((data) => data.p.Ref == StageRef);;
      if (SingleRecord?.p) {
        this.StageType = SingleRecord.p.StageType;
        this.IsStage = SingleRecord.p.IsSubStageApplicable;
      }
    } catch (error) {

    }
  }

  getVendorListByCompanyRef = async () => {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.VendorList = []
      let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.VendorList = lst;
    } catch (error) {

    }
  }

  // getVendorServiceListByVendorRef = async (VendorRef: number) => {
  //   try {
  //     if (this.IsNewEntity) {
  //       this.Entity.p.VendorServiceRef = 0
  //     }
  //     this.VendorServiceList = []
  //     let lst = await VendorService.FetchEntireListByVendorRef(VendorRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //     this.VendorServiceList = lst;
  //   } catch (error) {

  //   }
  // }
  getVendorServiceListByVendorRef = async (VendorRef: number) => {
    if (this.IsNewEntity) {
      this.Entity.p.VendorServiceRef = 0
    }
    this.VendorServiceList = []
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchInstance(VendorRef, this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst.p.ServiceListSuppliedByVendor;
    this.VendorServiceListByVendor = []; // Clear existing list first
    if (this.VendorServiceList.length > 0) {
      await this.FormulateVendorServiceList();
      const refArray = this.VendorServiceList.map(s => Number(s));
      const matched = this.VendorServiceListByVendor.filter(service => refArray.includes(service.p.Ref));
      console.log('matched :', matched);
      this.VendorServiceListByVendor = matched; // Either matched list or stays empty
    }
  }
  private FormulateVendorServiceList = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.VendorServiceListByVendor = []
    let lst = await VendorService.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.VendorServiceListByVendor = lst;
  };
  

  FormulateUnitList = async () => {
    try {
      let lst = await Unit.FetchEntireList(
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.UnitList = lst;
    } catch (error) {

    }
  };

  ClearInputsOnExpenseChange = (ExpenseTypeRef: number) => {
    this.AddExpenseTypeToOther(ExpenseTypeRef)
    this.Entity.p.GrandTotal = 0;
    this.Entity.p.Amount = 0;
    this.Entity.p.UnitRef = 0;
    this.Entity.p.Quantity = 0;
    this.Entity.p.Rate = 0;
    this.Amount = 0;
    if (this.Entity.p.ExpenseTypeRef == this.MachinaryExpenseTypeRef) {
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
      this.Entity.p.GrandTotal = 0,
      this.Entity.p.Rate = 0
      this.Entity.p.Quantity = 0
      this.Entity.p.Amount = 0,
        this.Amount = 0
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

  // CalculateAmountOnRateAndQuantity = () => {
  //   const TotalWorkedHours = this.getTotalWorkedHours()
  //   const rate = Number(this.Entity.p.Rate) || 0;
  //   const quantity = Number(this.Entity.p.Quantity) || 0;
  //   const dieselAmount = Number(this.Entity.p.DieselTotalAmount) || 0;
  //   const isDieselPaid = !!this.Entity.p.IsDieselPaid;

  //   if (TotalWorkedHours > 0) {
  //     this.Entity.p.GrandTotal = rate * TotalWorkedHours - dieselAmount
  //     this.Amount = rate * TotalWorkedHours
  //   } else {
  //     this.Amount = rate * quantity
  //     this.Entity.p.GrandTotal = rate * quantity - dieselAmount
  //   }
  // };
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
      this.Entity.p.Amount = rate * quantity
      this.Entity.p.GrandTotal = rate * quantity - dieselAmount

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
    try {
      if (!this.ExpenseTypeEntity.p.Name) {
        await this.uiUtils.showErrorMessage('Error', 'Expense Type name is required!');
        this.isAddingExpense = false;
        return;
      }
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
        await this.uiUtils.showSuccessToster('Expense Type saved successfully!');
        this.ExpenseTypeEntity = ExpenseType.CreateNewInstance();
        this.ExpenseTypeEntity.p.Name = ''
        this.isAddingExpense = false
        this.getExpenseListByStageRef(this.Entity.p.StageRef)
      }
    } catch (error) {

    }
  }

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveStageMaster = async () => {
    try {
      // this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
      this.Entity.p.CompanyRef = this.companyRef;
      // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      this.Entity.p.CompanyName = this.companyName;
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
          await this.uiUtils.showSuccessToster('Actual Stage saved successfully!');
          this.Entity = ActualStages.CreateNewInstance();
          await this.router.navigate(['app_homepage/tabs/site-management/actual-stage'], { replaceUrl: true });
        } else {
          await this.uiUtils.showSuccessToster('Stage Updated successfully!');
          await this.router.navigate(['app_homepage/tabs/site-management/actual-stage'], { replaceUrl: true });
        }
      }
    } catch (error) {

    }
  }
  public goBack(): void {
    this.router.navigate(['app_homepage/tabs/site-management/actual-stage'], { replaceUrl: true });
  }
}
