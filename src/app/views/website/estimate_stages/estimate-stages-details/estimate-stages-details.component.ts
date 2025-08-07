import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { SubStage } from 'src/app/classes/domain/entities/website/masters/substage/subStage';
import { EstimateStages } from 'src/app/classes/domain/entities/website/site_management/estimatestages/estimatestages';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-estimate-stages-details',
  templateUrl: './estimate-stages-details.component.html',
  standalone: false,
  styleUrls: ['./estimate-stages-details.component.scss'],
})
export class EstimateStagesDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: EstimateStages = EstimateStages.CreateNewInstance();
  DetailsFormTitle: 'New Estimate Stage' | 'Edit Estimate Stage' = 'New Estimate Stage';
  InitialEntity: EstimateStages = null as any;
  SiteList: Site[] = [];
  StageList: Stage[] = [];
  SubStageList: SubStage[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;


  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('estimateForm') estimateForm!: NgForm;
  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('AmountCtrl') AmountInputControl!: NgModel;
  @ViewChild('DescriptionCtrl') DescriptionInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private dtu: DTU,) {
    effect(async () => {
      await this.getStageListByCompanyRef();
    });
  }


  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Estimate Stage' : 'Edit Estimate Stage';
      this.Entity = EstimateStages.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.Entity.p.TransDateTime != '') {
        this.Entity.p.TransDateTime = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.TransDateTime)
      }
    } else {
      this.Entity = EstimateStages.CreateNewInstance();
      EstimateStages.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(EstimateStages.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as EstimateStages;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Amount')!;
    txtName.focus();
  }

  getSiteListByCompanyRef = async () => {
    this.SiteList = [];
    this.Entity.p.SiteRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    // this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
  }

  getStageListByCompanyRef = async () => {
    this.Entity.p.StageRef = 0;
    this.StageList = []
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst;
  }

  getSubStageListByStageRef = async (stageref: number) => {
    this.Entity.p.SubStageRef = 0
    this.SubStageList = [];
    if (stageref > 0) {
      let lst = await SubStage.FetchEntireListByStageRef(stageref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.SubStageList = lst;
    }
  }


  SaveStageMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.TransDateTime = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.TransDateTime)
    if (!this.Entity.p.Amount) {
      this.Entity.p.Amount = 0;
    }
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
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
        await this.uiUtils.showSuccessToster('Estimate Stage saved successfully');
        this.Entity = EstimateStages.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Estimate Stage Updated successfully');
        await this.router.navigate(['/homepage/Website/Estimate_Stages']);
      }
    }
  }

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackEstimateStage = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Estimate Stages Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Estimate_Stages']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Estimate_Stages']);
    }
  }

  resetAllControls() {
    this.estimateForm.resetForm(); // this will reset all form controls to their initial state
  }
}




