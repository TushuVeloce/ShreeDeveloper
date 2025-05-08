import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainEnums, StageType } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { ActualStages } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { Time, TimeDetailProps } from 'src/app/classes/domain/entities/website/site_management/time/time';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: ActualStages = ActualStages.CreateNewInstance();
  ExpenseTypeEntity: ExpenseType = ExpenseType.CreateNewInstance();
  DetailsFormTitle: 'New Actual Stage' | 'Edit Actual Stage' = 'New Actual Stage';
  InitialEntity: ActualStages = null as any;
  StageTypeEnum = StageType;
  StageType: number = 0;
  IsStage: Boolean = false;
  StageTypeList = DomainEnums.StageTypeList();
  MonthList = DomainEnums.MonthList();
  VendorList: Vendor[] = [];
  VendorServiceList: VendorService[] = [];
  StageList: Stage[] = [];
  SiteList: Site[] = [];
  SubStageList: SubStage[] = [];
  ExpenseTypeList: ExpenseType[] = [];
  UnitList: Unit[] = [];
  UnitQuantityTotal: number = 0;
  isAddingExpense = false;
  isAdd = false;
  isOfficialExpenditureGov = false
  isModalOpen: boolean = false;
  timeheaders: string[] = ['Sr.No.', 'Start Time ', 'End Time', 'Action'];
  TimeEntity: TimeDetailProps = TimeDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef: number = 0;
  companyName: any = '';
  siteRef: number = 0;
  siteName: string | null = '';
  Date: string | null = null;
  SelectedMonth: any[] = [];

  constructor(private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private appStateManagement: AppStateManageService
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
      await this.getStageListByCompanyRef();
      await this.getVendorListByCompanyRef();
      await this.FormulateUnitList();
      await this.getSiteListByCompanyRef();
      this.siteRef = Number(this.appStateManagement.StorageKey.getItem('siteRf'));
      this.siteName = this.appStateManagement.StorageKey.getItem('siteName') ? this.appStateManagement.StorageKey.getItem('siteName') : '';
      this.Entity.p.SiteRef = this.siteRef;
      this.Entity.p.SiteName = this.siteName??'';
      if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
        this.IsNewEntity = false;
        this.DetailsFormTitle = this.IsNewEntity ? 'New Actual Stage' : 'Edit Actual Stage';
        this.Entity = ActualStages.GetCurrentInstance();
        console.log('Entity :', this.Entity);
        await this.OnStageChange(this.Entity.p.StageRef)
        this.appStateManage.StorageKey.removeItem('Editable')
      } else {
        this.companyRef;
        this.Entity = ActualStages.CreateNewInstance();
        ActualStages.SetCurrentInstance(this.Entity);
        this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
        await this.getSingleEmployeeDetails();
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
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.UnitList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Unit', 1, (selected) => {
        selectData = selected;
        this.Entity.p.UnitName = selected[0].p.Name;
        this.Entity.p.UnitRef = selected[0].p.Ref;
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectGutterNaleUnitBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.UnitList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Gutter Nale Unit', 1, (selected) => {
        selectData = selected;
        this.Entity.p.GutterNaleUnitRef = selected[0].p.Ref;
        this.Entity.p.GutterNaleUnitName = selected[0].p.Name;
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectMonthsBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      const options = this.MonthList.map((item) => ({ p: item }));

      let selectData: any[] = [];

      this.openSelectModal(options, this.SelectedMonth, true, 'Select months', 12, (selected) => {
        this.SelectedMonth = selected;
        // console.log('selected :', selected.map(item => item.p.Ref));
        this.Entity.p.SelectedMonths = selected.map(item => item.p.Ref);
        this.Entity.p.SelectedMonthsName = selected.map(item => item.p.Name);
        // this.onSelectedMonthsChange(this.Entity.p.SelectedMonths)
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectSubStageBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.SubStageList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Vendor', 1, (selected) => {
        selectData = selected;
        this.Entity.p.SubStageRef = selected[0].p.Ref;
        this.Entity.p.SubStageName = selected[0].p.Name;
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectVendorBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.VendorList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Vendor', 1, (selected) => {
        selectData = selected;
        this.Entity.p.VendorRef = selected[0].p.Ref;
        this.Entity.p.VendorName = selected[0].p.Name;
        this.getVendorServiceListByVendorRef(selected[0].p.Ref)
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectVendorServicesBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.VendorServiceList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Vendor Service', 1, (selected) => {
        selectData = selected;
        this.Entity.p.VendorServiceRef = selected[0].p.Ref;
        this.Entity.p.VendorServiceName = selected[0].p.Name;
        this.ClearInputsOnExpenseChange();
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectExpenseTypeBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.ExpenseTypeList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Expense Type', 1, (selected) => {
        selectData = selected;
        console.log('Expense Type selected :', selected);
        this.Entity.p.ExpenseTypeRef = selected[0].p.ExpenseType;
        this.Entity.p.ExpenseTypeName = selected[0].p.ExpenseTypeName ? selected[0].p.ExpenseTypeName : selected[0].p.Name;
        this.ClearInputsOnExpenseChange();
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }
  public async selectStageBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.StageList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Stage', 1, (selected) => {
        selectData = selected;
        this.Entity.p.StageRef = selected[0].p.Ref;
        this.Entity.p.StageName = selected[0].p.Name;
        this.OnStageChange(selected[0].p.Ref)
        // console.log('selected :', selected);
      });
    } catch (error) {
      // console.log('error :', error);
    }
  }

  public async selectSiteBottomsheet(): Promise<void> {
    try {
      // Filter the list before mapping
      // const filteredList = this.CustomerStatusList.filter(
      //   (item) => item.Ref !== CustomerStatus.ConvertToDeal && item.Ref !== CustomerStatus.LeadClosed
      // );

      // const options = this.MonthList.map((item) => ({ p: item }));
      const options = this.SiteList;

      let selectData: any[] = [];

      this.openSelectModal(options, selectData, false, 'Select Site', 1, (selected) => {
        selectData = selected;
        this.Entity.p.SiteRef = selected[0].Ref;
        this.Entity.p.SiteName = selected[0].p.Name;
        console.log('selected :', selected);
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


  ChalanNo = () => {

  }

  getSingleEmployeeDetails = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.CreatedBy == 1001) {
      this.Entity.p.CreatedByName = 'Admin';
      return;
    }
    let data = await Employee.FetchInstance(
      this.Entity.p.CreatedBy, this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.Entity.p.CreatedByName = data.p.Name;
    this.Entity.p.UpdatedBy = data.p.Ref;
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
    if (this.companyRef <= 0) {
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
    this.Entity.p.SubStageRef = 0
    let stagedata = await Stage.FetchInstance(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (stagedata.p.IsOtherExpenseApplicable == true) {
      this.isAdd = true
    } else {
      this.isAdd = false
    }
    if (stagedata.p.StageTypeName == "Official Expenditure Gov") {
      this.isOfficialExpenditureGov = true
    } else {
      this.isOfficialExpenditureGov = false
    }
    await this.getSubStageListByStageRef(StageRef);
    await this.getExpenseListByStageRef(StageRef);
    await this.getStageTypeOnStageRef(StageRef);
  }

  getSubStageListByStageRef = async (StageRef: number) => {
    // if (StageRef <= 0) {
    //   await this.uiUtils.showErrorToster('Stage not Selected');
    //   return;
    // }
    let lst = await SubStage.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubStageList = lst;
    // if (this.SubStageList.length > 0) {
    //   this.Entity.p.SubStageRef = this.SubStageList[0].p.Ref;
    // }
  }

  getExpenseListByStageRef = async (StageRef: number) => {
    // if (StageRef <= 0) {
    //   await this.uiUtils.showErrorToster('Stage not Selected');
    //   return;
    // }
    let lst = await ExpenseType.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ExpenseTypeList = lst;
    // if (this.SubStageList.length > 0) {
    //   this.Entity.p.SubStageRef = this.SubStageList[0].p.Ref;
    // }
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
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
  }

  getVendorServiceListByVendorRef = async (VendorRef: number) => {
    if (VendorRef <= 0) {
      await this.uiUtils.showErrorToster('Vendor not Selected');
      return;
    }
    this.VendorServiceList = []
    this.Entity.p.VendorRef = 0
    let lst = await VendorService.FetchEntireListByVendorRef(VendorRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst;
    // if (this.VendorList.length > 0) {
    //   this.Entity.p.VendorServiceRef = this.VendorServiceList[0].p.Ref;
    // }
  }

  public FormulateUnitList = async () => {
    let lst = await Unit.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.UnitList = lst;
    console.log('this.UnitList  :', this.UnitList);
  };

  ClearInputsOnExpenseChange = () => {
    this.Entity.p.Amount = 0;
    if (this.Entity.p.ExpenseTypeRef == 100) {
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

    if (this.Entity.p.ExpenseTypeRef == 200) {
      this.Entity.p.DieselRate = 0;
      this.Entity.p.DieselQuantity = 0;
      this.Entity.p.DieselTotalAmount = 0;
      this.Entity.p.IsDieselPaid = 0;
      this.Entity.p.VehicleNo = '';

    }
  }

  CalculateTotalOnDiselRateAndLtr = () => {
    this.Entity.p.DieselTotalAmount = (this.Entity.p.DieselQuantity * this.Entity.p.DieselRate);
    this.Entity.p.Amount = this.Entity.p.DieselTotalAmount + this.UnitQuantityTotal
  }

  CalculateAmountOnRateAndQuantity = () => {
    const rate = Number(this.Entity.p.Rate) || 0;
    const quantity = Number(this.Entity.p.Quantity) || 0;
    const diesel = Number(this.Entity.p.DieselTotalAmount) || 0;

    this.UnitQuantityTotal = rate * quantity;

    if (this.Entity.p.IsDieselPaid) {
      this.Entity.p.Amount = this.UnitQuantityTotal - diesel;
    } else {
      this.Entity.p.Amount = this.UnitQuantityTotal;
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


  originalAmount: number = 0;
  TotalAmount = () => {
    if (!this.originalAmount) {
      this.originalAmount = this.Entity.p.Amount; // store initial
    }

    if (this.Entity.p.IsDieselPaid && this.Entity.p.DieselTotalAmount) {
      this.Entity.p.Amount = this.originalAmount - Number(this.Entity.p.DieselTotalAmount);
    } else {
      this.Entity.p.Amount = this.originalAmount;
    }
  };



  onSelectedMonthsChange = (Selectedservice: any) => {
    this.Entity.p.SelectedMonths = Selectedservice;
  }


  SaveStageMaster = async () => {
    this.Entity.p.CompanyRef = this.companyRef
    this.Entity.p.CompanyName = this.companyName
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
        await this.uiUtils.showSuccessToster('Stage saved successfully!');
        this.Entity = ActualStages.CreateNewInstance();
        // this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Stage Updated successfully!');
        await this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage']);

      }
    }
  }

  saveNewExpenseType = async () => {
    if (this.ExpenseTypeEntity.p.StageRef <= 0 && this.ExpenseTypeEntity.p.Name == '') {
      await this.uiUtils.showWarningToster('Expense Type is empty!');
      this.isAddingExpense = false
      return
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

  toggleExpenseInput() {
    this.isAddingExpense = !this.isAddingExpense;
    if (!this.isAddingExpense) {
      this.ExpenseTypeEntity.p.Name = '';
    }
  }

  async SaveTime() {
    if (!this.TimeEntity.StartTime || !this.TimeEntity.EndTime) {
      await this.uiUtils.showErrorMessage('Error', 'Name, Contact No, Country, State, City, Adderss are Required!');
      return;
    }

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.TimeDetails[this.editingIndex] = { ...this.TimeEntity };
      await this.uiUtils.showSuccessToster('Time updated successfully!');
      this.isModalOpen = false;

    } else {
      let TimeInstance = new Time(this.TimeEntity, true);
      //  let siteInstance = new ActualStages(this.Entity.p, true);
      await TimeInstance.EnsurePrimaryKeysWithValidValues();
      //  await siteInstance.EnsurePrimaryKeysWithValidValues();

      this.TimeEntity.SiteManagementRef = this.Entity.p.Ref;
      this.Entity.p.TimeDetails.push({ ...TimeInstance.p });
      await this.uiUtils.showSuccessToster('Owner added successfully!');
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
    this.Entity.p.TimeDetails.splice(index, 1); // Remove owner
  }
  public goBack(): void {
    this.router.navigate(['app_homepage/tabs/site-management/actual-stage'], { replaceUrl: true });
  }
}
