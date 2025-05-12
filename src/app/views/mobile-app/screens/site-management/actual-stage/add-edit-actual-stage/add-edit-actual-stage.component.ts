import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseTypeRefs, UnitRefs } from 'src/app/classes/domain/constants';
import { DomainEnums, StageType } from 'src/app/classes/domain/domainenums/domainenums';
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

  Entity: ActualStages = ActualStages.CreateNewInstance();
  ExpenseTypeEntity: ExpenseType = ExpenseType.CreateNewInstance();
  VendorServicesEntity: Vendor = Vendor.CreateNewInstance();
  private IsNewEntity: boolean = true;
  DetailsFormTitle: 'New Actual Stage' | 'Edit Actual Stage' = 'New Actual Stage';
  InitialEntity: ActualStages = null as any;
  isSaveDisabled: boolean = false;
  VendorList: Vendor[] = [];
  VendorServiceList: VendorService[] = [];
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
  isModalOpen: boolean = false;
  timeheaders: string[] = ['Sr.No.', 'Start Time ', 'End Time', 'Worked Hours', 'Action'];
  TimeEntity: TimeDetailProps = TimeDetailProps.Blank();
  editingIndex: null | undefined | number
  isChalanDisabled = false
  Amount: number = 0
  originalAmount: number = 0;
  strCDT: string = ''
  ExpenseTypeRef: number = ExpenseTypeRefs.MachinaryExpense
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
  selectedGutterNaleUnit : any[] = [];

  Date: string | null = null;
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
  //   // console.log('Leave request refreshed on view enter');
  // };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  DateChange(value: string) {
    this.Date = value;
    this.Entity.p.Date = value || '';
    console.log('Date:', this.Date);
  }


  private async loadCustomerEnquiryIfEmployeeExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.appStateManage.setDropdownDisabled(true);
      this.siteRef = Number(this.appStateManagement.StorageKey.getItem('siteRf'));
      this.siteName = this.appStateManagement.StorageKey.getItem('siteName') ? this.appStateManagement.StorageKey.getItem('siteName') : '';
      this.selectedSite = [
        {
          "p": {
            "Ref": this.siteRef,
            "Name": this.siteName??''
          }
        }
    ];
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
        console.log('Entity :', this.Entity);
        if (this.Entity.p.TimeDetails.length > 0) {
          this.Amount = this.getTotalWorkedHours()
        } else {
          this.Amount = this.Entity.p.Rate * this.Entity.p.Quantity
        }
        await this.DiselPaid(this.Entity.p.IsDieselPaid)
        await this.OnStageChange(this.Entity.p.StageRef)
        this.getVendorServiceListByVendorRef(this.Entity.p.VendorRef);
        this.appStateManage.StorageKey.removeItem('Editable')
      } else {
        this.Entity = ActualStages.CreateNewInstance();
        ActualStages.SetCurrentInstance(this.Entity);
        const CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
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
      // this.focusInput();
    } catch (error) {
      // console.log('error :', error);

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
      // console.log('error :', error);
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
      // console.log('error :', error);
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
      // console.log('error :', error);
    }
  }

  public async selectSubStageBottomsheet(): Promise<void> {
    try {
      const options = this.SubStageList;
      this.openSelectModal(options, this.selectedSubStage, false, 'Select Vendor', 1, (selected) => {
        this.selectedSubStage = selected;
        this.Entity.p.SubStageRef = this.selectedSubStage[0].p.Ref;
        this.Entity.p.SubStageName = this.selectedSubStage[0].p.Name;
      });
    } catch (error) {
      // console.log('error :', error);
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
      // console.log('error :', error);
    }
  }

  public async selectVendorServicesBottomsheet(): Promise<void> {
    try {
      if (this.Entity.p.VendorRef <= 0) {
        await this.uiUtils.showErrorToster('Vendor is not Selected');
        return ;
      }
      const options = this.VendorServiceList;
      this.openSelectModal(options, this.selectedVendorService, false, 'Select Vendor Service', 1, (selected) => {
        this.selectedVendorService = selected;
        this.Entity.p.VendorServiceRef = this.selectedVendorService[0].p.Ref;
        this.Entity.p.VendorServiceName = this.selectedVendorService[0].p.Name;
        // this.ClearInputsOnExpenseChange();
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectExpenseTypeBottomsheet(): Promise<void> {
    try {
      const options = this.ExpenseTypeList;
      this.openSelectModal(options, this.selectedExpenseType, false, 'Select Expense Type', 1, (selected) => {
        this.selectedExpenseType = selected;
        console.log('Expense Type selected :', selected);
        this.Entity.p.ExpenseTypeRef = this.selectedExpenseType[0].p.ExpenseType;
        this.Entity.p.ExpenseTypeName = this.selectedExpenseType[0].p.ExpenseTypeName ? selected[0].p.ExpenseTypeName : selected[0].p.Name;
        this.ClearInputsOnExpenseChange(this.Entity.p.ExpenseTypeRef);
      });
    } catch (error) {
      // console.log('error :', error);
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
      // console.log('error :', error);
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
      // console.log('error :', error);
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
  
  
  getSingleEmployeeDetails = async (CreatedBy:number) => {
    if (this.Entity.p.CreatedBy == 1001) {
      this.Entity.p.CreatedByName = 'Admin';
      return;
    }
    let data = await Employee.FetchInstance(CreatedBy, this.companyRef,async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('data :', data);
  };


  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    // if (this.SiteList.length > 0) {
    //   this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
    // }
  }

  getStageListByCompanyRef = async () => {
    if (this.companyRef<= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
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
    if(this.IsNewEntity){
      this.Entity.p.ExpenseTypeRef = 0
      await this.AddExpenseTypeToOther( this.Entity.p.ExpenseTypeRef )
    }
    let stagedata = await Stage.FetchInstance(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    // if(stagedata.p.IsOtherExpenseApplicable == true){
    //   this.isAdd = true
    // }else{
    //   this.isAdd = false
    // }
    if(stagedata.p.StageTypeName == "Official Expenditure Gov"){
      this.isOfficialExpenditureGov = true
    }else{
      this.isOfficialExpenditureGov = false
    }
    
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
    console.log('ExpenseTypeList :', this.ExpenseTypeList);
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
      this.StageType = SingleRecord.p.StageType;
      this.IsStage = SingleRecord.p.IsSubStageApplicable;
    }
    // let SingleRecord = await Stage.FetchInstance(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    // this.StageType = SingleRecord.p.StageType;
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.VendorList = []
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
    // if (this.VendorList.length > 0) {
    //   this.Entity.p.VendorRef = this.VendorList[0].p.Ref;
    // }
    // this.getVendorServiceListByVendorRef();
  }

  getVendorServiceListByVendorRef = async (VendorRef:number) => {
    if(this.IsNewEntity){
      this.Entity.p.VendorServiceRef = 0
    }
    this.VendorServiceList = []
    let lst = await VendorService.FetchEntireListByVendorRef(VendorRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst;
  }

  FormulateUnitList = async () => {
    let lst = await Unit.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.UnitList = lst;
    console.log('UnitList :', this.UnitList);
  };

  ClearInputsOnExpenseChange = (ExpenseTypeRef:number) => {
    this.AddExpenseTypeToOther(ExpenseTypeRef)
    this.Entity.p.Amount = 0;
    this.Entity.p.UnitRef = 0;
    this.Entity.p.Quantity = 0;
    this.Entity.p.Rate = 0;
    this.Amount = 0;
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

    if (this.Entity.p.ExpenseTypeRef  == this.LabourExpenseRef) {
      this.Entity.p.DieselRate = 0;
      this.Entity.p.DieselQuantity = 0;
      this.Entity.p.DieselTotalAmount = 0;
      this.Entity.p.IsDieselPaid = 0;
      this.Entity.p.VehicleNo = '';
    }
    this.Entity.p.TimeDetails = []
  }

  ClearValuesOnTimeSelection = (UnitRef:number) => {
    this.Entity.p.TimeDetails = []
    if( UnitRef == this.TimeUnitRef){
      this.Entity.p.Rate = 0
      this.Entity.p.Quantity = 0
      this.Entity.p.Amount = 0,
      this.Amount = 0
    }
    this.isDiselPaid = false
    this.DiselPaid(0)
   
  }

  AddExpenseTypeToOther = async(ExpenseTypeRef:number) =>{
  console.log('ExpenseTypeRef :', ExpenseTypeRef);
    if (ExpenseTypeRef == this.OtherExpenseRef){
      this.isAdd = true
    }else{
      this.isAdd = false
    }
  }

  CalculateTotalOnDiselRateAndLtr = () => {
    this.Entity.p.DieselTotalAmount = (this.Entity.p.DieselQuantity * this.Entity.p.DieselRate);
    this.Entity.p.Amount = this.Entity.p.DieselTotalAmount + this.UnitQuantityTotal
    this.CalculateAmountOnRateAndQuantity()
  }

  CalculateAmountOnRateAndQuantity = () => {
    const TotalWorkedHours = this.getTotalWorkedHours()
    const rate = Number(this.Entity.p.Rate) || 0;
    const quantity = Number(this.Entity.p.Quantity) || 0;
    const dieselAmount = Number(this.Entity.p.DieselTotalAmount) || 0;
    const isDieselPaid = !!this.Entity.p.IsDieselPaid;
    
    if(TotalWorkedHours > 0){
      this.Entity.p.Amount= rate * TotalWorkedHours - dieselAmount
      this.Amount = rate * TotalWorkedHours
    }else{
      this.Amount = rate * quantity
      this.Entity.p.Amount= rate * quantity - dieselAmount
     
    }
  };


  CalculateAmountOnSkillRateAndQuantity = () => {
    this.Entity.p.SkillAmount = (this.Entity.p.SkillRate * this.Entity.p.SkillQuantity);
    this.Entity.p.Amount = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
  }

  CalculateAmountOnUnSkillRateAndQuantity = () => {
    this.Entity.p.UnskillAmount = (this.Entity.p.UnskillRate * this.Entity.p.UnskillQuantity);
    this.Entity.p.Amount = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
  }

  CalculateAmountOnLadiesRateAndQuantity = () => {
    this.Entity.p.LadiesAmount = (this.Entity.p.LadiesRate * this.Entity.p.LadiesQuantity);
    this.Entity.p.Amount = this.Entity.p.SkillAmount + this.Entity.p.UnskillAmount + this.Entity.p.LadiesAmount;
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

  DiselPaid = (DiselPaid:number) => {
  if(DiselPaid == 1){
    this.isDiselPaid = true
    this.Entity.p.IsDieselPaid = 1;
  }else{
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
    if (!this.ExpenseTypeEntity.p.Name) {
      await this.uiUtils.showErrorMessage('Error', 'Expense Type name is required!');
      this.isAddingExpense = false;
      return;
    }
    this.ExpenseTypeEntity.p.StageRef = this.Entity.p.StageRef
    let entityToSave = this.ExpenseTypeEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    console.log('entitiesToSave :', entitiesToSave);
    await this.ExpenseTypeEntity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
        await this.uiUtils.showSuccessToster('Expense Type saved successfully!');
        this.ExpenseTypeEntity= ExpenseType.CreateNewInstance();
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
    await this.uiUtils.showSuccessToster('Time updated successfully!');
    this.isModalOpen = false;
  } else {
    this.TimeEntity.SiteManagementRef = this.Entity.p.Ref;
    this.Entity.p.TimeDetails.push({ ...this.TimeEntity });
    this.CalculateAmountOnRateAndQuantity()
    await this.uiUtils.showSuccessToster('Time added successfully!');
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


  SaveStageMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.Total = this.getTotalWorkedHours()
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    console.log('entitiesToSave :', entitiesToSave);
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
      } else {
        await this.uiUtils.showSuccessToster('Stage Updated successfully!');
        await this.router.navigate(['app_homepage/tabs/site-management/actual-stage'], { replaceUrl: true });
      }
    }
  }
  public goBack(): void {
    this.router.navigate(['app_homepage/tabs/site-management/actual-stage'], { replaceUrl: true });
  }
}
