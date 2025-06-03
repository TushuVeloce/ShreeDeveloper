import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-expense-type-master-details',
  standalone: false,
  templateUrl: './expense-type-master-details.component.html',
  styleUrls: ['./expense-type-master-details.component.scss'],
})
export class ExpenseTypeMasterDetailsComponent implements OnInit {
  Entity: ExpenseType = ExpenseType.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Expense Type' | 'Edit Expense Type' = 'New Expense Type';
  IsDropdownDisabled: boolean = false;
  InitialEntity: ExpenseType = null as any;
  StageList: Stage[] = [];
  isAdd = false;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.StageList = await Stage.FetchEntireListByCompanyRef(this.companyRef());
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.IsDropdownDisabled = true;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Expense Type'
        : 'Edit Expense Type';
      this.Entity = ExpenseType.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = ExpenseType.CreateNewInstance();
      ExpenseType.SetCurrentInstance(this.Entity);
      this.getStageListByCompanyRef()
    }
    this.InitialEntity = Object.assign(
      ExpenseType.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as ExpenseType;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  getStageListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst.filter((data) => data.p.IsOtherExpenseApplicable);
    if (this.StageList.length > 0) {
      this.Entity.p.StageRef = this.StageList[0].p.Ref;
    }
  }

  AlertforStageSelection = () => {
    this.uiUtils.showErrorMessage('Error', 'This Stage does not have Other Expense');

  }

  SaveExpenseTypeMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
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
        await this.uiUtils.showSuccessToster('Expense Type saved successfully!');
        this.Entity = ExpenseType.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Expense Type Updated successfully!');
        this.BackExpenseType()
      }
    }
  };

  BackExpenseType = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Expense Type Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Expense_Type_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Expense_Type_Master']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty

    this.NameInputControl.control.markAsPristine();
  }
}

