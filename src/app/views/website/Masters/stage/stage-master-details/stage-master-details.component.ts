import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stage-master-details',
  standalone: false,
  templateUrl: './stage-master-details.component.html',
  styleUrls: ['./stage-master-details.component.scss'],
})
export class StageMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: Stage = Stage.CreateNewInstance();
  DetailsFormTitle: 'New Stage' | 'Edit Stage' = 'New Stage';
  InitialEntity: Stage = null as any;
  StageTypeList = DomainEnums.StageTypeList(true,'select stage');

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
      this.Entity = Stage.GetCurrentInstance();
      console.log('Entity :', this.Entity);
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Stage.CreateNewInstance();
      Stage.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(Stage.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Stage;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  SaveStageMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    if (!this.Entity.p.DisplayOrder) {
      this.Entity.p.DisplayOrder = 0;
    }
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
        this.Entity = Stage.CreateNewInstance();
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

  BackStage = () => {
    this.router.navigate(['/homepage/Website/Stage_Master']);
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
