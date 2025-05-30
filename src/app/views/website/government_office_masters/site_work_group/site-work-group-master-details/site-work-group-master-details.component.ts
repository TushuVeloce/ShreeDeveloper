import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-siteworkgroup-master-details',
  standalone: false,
  templateUrl: './site-work-group-master-details.component.html',
  styleUrls: ['./site-work-group-master-details.component.scss'],
})
export class SiteWorkGroupMasterDetailsComponent implements OnInit {
  Entity: SiteWorkGroup = SiteWorkGroup.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Site Work Group' | 'Edit Site Work Group' = 'New Site Work Group';
  IsDropdownDisabled: boolean = false
  InitialEntity: SiteWorkGroup = null as any;
  InputNumber: string = ValidationPatterns.InputNumber
  InputNumberMsg: string = ValidationMessages.InputNumberMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New Site Work Group' : 'Edit Site Work Group';
      this.Entity = SiteWorkGroup.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = SiteWorkGroup.CreateNewInstance();
      SiteWorkGroup.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(SiteWorkGroup.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as SiteWorkGroup;
    // this.focusInput();
  }

   // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }


  SaveSiteWorkGroupMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();

    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Site Work Group saved successfully!');
        this.Entity = SiteWorkGroup.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Site Wor Group Updated successfully!');
        this.BackSiteWorkGroup()
      }
    }
  }

  BackSiteWorkGroup() {
    this.router.navigate(['/homepage/Website/Site_Work_Group']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }

}
