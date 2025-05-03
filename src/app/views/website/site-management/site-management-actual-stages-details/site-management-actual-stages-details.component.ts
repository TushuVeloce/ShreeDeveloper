import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
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
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-site-management-actual-stages-details',
  templateUrl: './site-management-actual-stages-details.component.html',
  standalone: false,
  styleUrls: ['./site-management-actual-stages-details.component.scss'],
})
export class SiteManagementActualStagesDetailsComponent implements OnInit {


  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: ActualStages = ActualStages.CreateNewInstance();
  DetailsFormTitle: 'New Stage' | 'Edit Stage' = 'New Stage';
  InitialEntity: ActualStages = null as any;
  StageTypeEnum = StageType;
  StageType: number = 0;
  IsStage: Boolean = false;
  Expense: number = 0;
  StageTypeList = DomainEnums.StageTypeList(true, 'select stage');
  MonthList = DomainEnums.MonthList(true, '--Select Month Type--');
  VendorList: Vendor[] = [];
  VendorServiceList: VendorService[] = [];
  StageList: Stage[] = [];
  SiteList: Site[] = [];
  SubStageList: SubStage[] = [];
  ExpenseTypeList: ExpenseType[] = [];
  UnitList: Unit[] = [];
  UnitQuantityTotal: number = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stage' : 'Edit Stage';
      this.Entity = ActualStages.GetCurrentInstance();

      this.appStateManage.StorageKey.removeItem('Editable')
    } else {
      this.Entity = ActualStages.CreateNewInstance();
      ActualStages.SetCurrentInstance(this.Entity);
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
      this.getStageListByCompanyRef();
      this.getVendorListByCompanyRef();
      this.FormulateUnitList();
      this.getSiteListByCompanyRef();
      this.getSingleEmployeeDetails();
    }
    this.InitialEntity = Object.assign(ActualStages.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as ActualStages;
    this.focusInput();
  }

  focusInput = () => {
    // let txtName = document.getElementById('Name')!;
    // txtName.focus();
  }

  getSingleEmployeeDetails = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let data = await Employee.FetchInstance(
      this.Entity.p.CreatedBy, this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.Entity.p.CreatedByName = data.p.Name;
    this.Entity.p.UpdatedBy = data.p.Ref;
  };


  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    if (this.SiteList.length > 0) {
      this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
    }
  }

  getStageListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst;
    if (this.StageList.length > 0) {
      this.Entity.p.StageRef = this.StageList[0].p.Ref;
      this.StageType = this.StageList[0].p.StageType;
      this.IsStage = this.StageList[0].p.IsSubStageApplicable;
    }
    this.getSubStageListByStageRef(this.Entity.p.StageRef);
    this.getExpenseListByStageRef(this.Entity.p.StageRef);
  }

  OnStageChange = async (StageRef: number) => {
    await this.getSubStageListByStageRef(StageRef);
    await this.getExpenseListByStageRef(StageRef);
    await this.getStageTypeOnStageRef(StageRef);
  }

  getSubStageListByStageRef = async (StageRef: number) => {
    if (StageRef <= 0) {
      await this.uiUtils.showErrorToster('Stage not Selected');
      return;
    }
    let lst = await SubStage.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubStageList = lst;
    if (this.SubStageList.length > 0) {
      this.Entity.p.SubStageRef = this.SubStageList[0].p.Ref;
    }
  }

  getExpenseListByStageRef = async (StageRef: number) => {
    if (StageRef <= 0) {
      await this.uiUtils.showErrorToster('Stage not Selected');
      return;
    }
    let lst = await ExpenseType.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ExpenseTypeList = lst;
    if (this.SubStageList.length > 0) {
      this.Entity.p.SubStageRef = this.SubStageList[0].p.Ref;
    }
  }

  getStageTypeOnStageRef = async (StageRef: number) => {
    if (this.Entity.p.StageRef <= 0) {
      await this.uiUtils.showErrorToster('Stage not Selected');
      return;
    }
    let SingleRecord = this.StageList.find((data) => data.p.Ref == StageRef);;
    if (SingleRecord?.p) {
      this.StageType = SingleRecord.p.StageType;
      this.IsStage = SingleRecord.p.IsSubStageApplicable;
    }
    // let SingleRecord = await Stage.FetchInstance(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    // this.StageType = SingleRecord.p.StageType;
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
    if (this.VendorList.length > 0) {
      this.Entity.p.VendorRef = this.VendorList[0].p.Ref;
    }
    this.getVendorServiceListByVendorRef();
  }

  getVendorServiceListByVendorRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await VendorService.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst;
    if (this.VendorList.length > 0) {
      this.Entity.p.VendorServiceRef = this.VendorServiceList[0].p.Ref;
    }
  }

  public FormulateUnitList = async () => {
    let lst = await Unit.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.UnitList = lst;
  };

  CalculateTotalOnDiselRateAndLtr = () => {
    this.Entity.p.DieselTotal = (this.Entity.p.DieselQuantity * this.Entity.p.DieselRate);
    this.Entity.p.Amount = this.Entity.p.DieselTotal + this.UnitQuantityTotal
  }

  CalculateAmountOnRateAndQuantity = () => {
    this.UnitQuantityTotal = (this.Entity.p.Rate * this.Entity.p.Quantity);
    this.Entity.p.Amount = this.Entity.p.DieselTotal + this.UnitQuantityTotal
  }


  onSelectedMonthsChange = (Selectedservice: any) => {
    this.Entity.p.SelectedMonths = Selectedservice;
  }


  SaveStageMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
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
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Stage Updated successfully!');
        await this.router.navigate(['/homepage/Website/Stage_Master']);

      }
    }
  }

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackActualStages = () => {
    this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage']);
  }

  resetAllControls = () => {
    // reset touched
    // this.NameInputControl.control.markAsUntouched();

    // // reset dirty
    // this.NameInputControl.control.markAsPristine();
  }
}

