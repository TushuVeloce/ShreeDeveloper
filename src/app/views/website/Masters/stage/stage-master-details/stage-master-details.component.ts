import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
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
  StageTypeList = DomainEnums.StageTypeList(true, '-- Select Stage Type --');

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg

  @ViewChild('stageForm') stageForm!: NgForm;
  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  // @ViewChild('DisplayOrderCtrl') DisplayOrderInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stage' : 'Edit Stage';
      this.Entity = Stage.GetCurrentInstance();
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
        await this.uiUtils.showSuccessToster('Stage saved successfully');
        this.Entity = Stage.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Stage Updated successfully');
        await this.router.navigate(['/homepage/Website/Stage_Master']);
      }
    }
  }

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }


  BackStage = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Stage Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Stage_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Stage_Master']);
    }
  }

  resetAllControls() {
    this.stageForm.resetForm();
  }
}
