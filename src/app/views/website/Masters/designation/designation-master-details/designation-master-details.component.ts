import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { Designation } from 'src/app/classes/domain/entities/website/masters/designation/designation';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-designation-master-details',
  standalone: false,
  templateUrl: './designation-master-details.component.html',
  styleUrls: ['./designation-master-details.component.scss'],
})
export class DesignationMasterDetailsComponent implements OnInit {

  Entity: Designation = Designation.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Designation' | 'Edit Designation' = 'New Designation';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Designation = null as any;
  DepartmentList: Department[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;


  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('SeniorityLevelCtrl') SeniorityLevelInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Designation'
        : 'Edit Designation';
      this.Entity = Designation.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.Entity = Designation.CreateNewInstance();
      Designation.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Designation.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Designation;
    // await this.FormulateDepartmentList();
    await this.getDepartmentListByCompanyRef();
  }


  getDepartmentListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Department.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DepartmentList = lst;
  }

  // public FormulateDepartmentList = async () => {
  //   let lst = await Department.FetchEntireListByCompanyRef(this.companyRef(),
  //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
  //   );
  //   this.DepartmentList = lst;
  // this.Entity.p.DepartmentRef = this.DepartmentList[0].p.Ref;
  // };

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveDesignationMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    let DepartmentRef = this.Entity.p.DepartmentRef;
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
        await this.uiUtils.showSuccessToster('Designation saved successfully');
        this.Entity = Designation.CreateNewInstance();
        this.resetAllControls();
        this.Entity.p.DepartmentRef = DepartmentRef;
      } else {
        await this.uiUtils.showSuccessToster('Designation Updated successfully');
        await this.router.navigate(['/homepage/Website/Designation_Master']);
      }
    }
  };

  BackDesignation = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Designation Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Designation_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Designation_Master']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.SeniorityLevelInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
    this.SeniorityLevelInputControl.control.markAsPristine();
  }

}
