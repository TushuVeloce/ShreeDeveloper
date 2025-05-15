import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingType } from 'src/app/classes/domain/entities/website/masters/marketingtype/marketingtype';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-marketing-type-master-details',
  standalone: false,
  templateUrl: './marketing-type-master-details.component.html',
  styleUrls: ['./marketing-type-master-details.component.scss'],
})

export class MarketingTypeMasterDetailsComponent implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: MarketingType = MarketingType.CreateNewInstance();
  DetailsFormTitle: 'New Marketing Type' | 'Edit Marketing Type' = 'New Marketing Type';
  InitialEntity: MarketingType = null as any;

  MarketingModesTypes = MarketingModes;
  MarketingModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;
  @ViewChild('DescriptionCtrl') DescriptionInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Marketing Type' : 'Edit Marketing Type';
      this.Entity = MarketingType.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = MarketingType.CreateNewInstance();
      MarketingType.SetCurrentInstance(this.Entity);
      this.Entity.p.MarketingMode = this.MarketingModesList[1].Ref;
    }
    this.InitialEntity = Object.assign(MarketingType.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as MarketingType;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Description')!;
    txtName.focus();
  }

  SaveMarketingTypeMaster = async () => {
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
        await this.uiUtils.showSuccessToster('Marketing saved successfully!');
        this.Entity = MarketingType.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Marketing Updated successfully!');
        await this.router.navigate(['/homepage/Website/Marketing_Type_Master']);
      }
    }
  }

  BackMarketingType = () => {
    this.router.navigate(['/homepage/Website/Marketing_Type_Master']);
  }

  resetAllControls = () => {
    // reset touched
    this.DescriptionInputControl.control.markAsUntouched();

    // reset dirty
    this.DescriptionInputControl.control.markAsPristine();
  }

}
