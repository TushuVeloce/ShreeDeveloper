import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
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
  StageTypeList = DomainEnums.StageTypeList(true, 'select stage');
  ExpenseList = DomainEnums.StageTypeList(true, 'select stage');
  VendorList: Vendor[] = [];
  StageList: Stage[] = [];
  SubStageList: SubStage[] = [];
  UnitList: Unit[] = [];
  VendorServicesList: Unit[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('DisplayOrderCtrl') DisplayOrderInputControl!: NgModel;

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
      this.getStageListByCompanyRef();
      this.getVendorListByCompanyRef();
      this.FormulateUnitList();
    }
    this.InitialEntity = Object.assign(ActualStages.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as ActualStages;
    this.focusInput();
  }

  focusInput = () => {
    // let txtName = document.getElementById('Name')!;
    // txtName.focus();
  }

  public FormulateUnitList = async () => {
    let lst = await Unit.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.UnitList = lst;
  };

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
    }
  }

  getSubStageListByStageRef = async () => {
    if (this.Entity.p.StageRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SubStage.FetchEntireListByStageRef(this.Entity.p.StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubStageList = lst;
    if (this.SubStageList.length > 0) {
      this.Entity.p.SubStageRef = this.SubStageList[0].p.Ref;
    }
  }

  calculateTotal() {
    this.Entity.p.TotalAmount = (this.Entity.p.DieselLtr * this.Entity.p.AmountPerLtr);
  }


  SaveStageMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
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
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackActualStages = () => {
    this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.DisplayOrderInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
    this.DisplayOrderInputControl.control.markAsPristine();
  }
}

