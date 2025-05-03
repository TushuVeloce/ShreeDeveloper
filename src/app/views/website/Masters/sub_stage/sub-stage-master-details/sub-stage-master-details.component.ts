import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';

@Component({
  selector: 'app-sub-stage-master-details',
  standalone: false,
  templateUrl: './sub-stage-master-details.component.html',
  styleUrls: ['./sub-stage-master-details.component.scss'],
})
export class SubStageMasterDetailsComponent  implements OnInit {
  Entity: SubStage = SubStage.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Sub Stage' | 'Edit Sub Stage' = 'New Sub Stage';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SubStage = null as any;
  StageList: Stage[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  StageTypeList = DomainEnums.StageTypeList(true,'select stage');
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
    this.getStageListByCompanyRef()
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Sub Stage'
        : 'Edit Sub Stage';
      this.Entity = SubStage.GetCurrentInstance();
      console.log('Entity :', this.Entity);
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if(this.Entity.p.StageRef > 0){
        this.onVendorChange(this.Entity.p.StageRef)
      }
    } else {
      this.Entity = SubStage.CreateNewInstance();
      SubStage.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      SubStage.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SubStage;
    this.focusInput();
  }

    onVendorChange = async (StageRef: number) => {
      const services = await Stage.FetchInstance(StageRef, async errMsg =>
        await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.Entity.p.StageTypeName = services.p.StageTypeName
    };


  getStageListByCompanyRef = async () => {
    this.StageList = []
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst.filter(stage => stage.p.IsSubStageApplicable === true);
  }

  focusInput = () => {
    let txtName = document.getElementById('Code')!;
    txtName.focus();
  }

  SaveSubStageMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entityToSave :', entityToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Sub Stage Master saved successfully!');
        this.Entity = SubStage.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Sub Stage Master Updated successfully!');
        await this.router.navigate(['/homepage/Website/Sub_Stage_Master']);
      }
    }
  };

  BackSubStage = () => {
    this.router.navigate(['/homepage/Website/Sub_Stage_Master']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty

    this.NameInputControl.control.markAsPristine();
  }
}
