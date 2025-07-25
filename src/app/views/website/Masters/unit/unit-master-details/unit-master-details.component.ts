import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-unit-master-details',
  standalone: false,
  templateUrl: './unit-master-details.component.html',
  styleUrls: ['./unit-master-details.component.scss'],
})

export class UnitMasterDetailsComponent implements OnInit {
  Entity: Unit = Unit.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Unit' | 'Edit Unit' = 'New Unit';
  IsDropdownDisabled: boolean = false
  InitialEntity: Unit = null as any;

  Unit: string = ValidationPatterns.SIUnit
  NameWithoutNos: string = ValidationPatterns.NameWithoutNos

  UnitMsg: string = ValidationMessages.SIUnitMsg
  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New Unit' : 'Edit Unit';
      this.Entity = Unit.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Unit.CreateNewInstance();
      Unit.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(Unit.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Unit;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  SaveUnitMaster = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Unit saved successfully');
        this.Entity = Unit.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Unit Updated successfully');
        await this.router.navigate(['/homepage/Website/Unit_Master']);
      }
    }
  }

  BackUnit = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Unit Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Unit_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Unit_Master']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }
}
