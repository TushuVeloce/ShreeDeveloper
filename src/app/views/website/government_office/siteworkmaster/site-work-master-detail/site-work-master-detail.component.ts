import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';
import { SiteWorkMaster } from 'src/app/classes/domain/entities/website/government_office/siteworkmaster/siteworkmaster';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';

@Component({
  selector: 'app-site-work-master-detail',
  standalone: false,
  templateUrl: './site-work-master-detail.component.html',
  styleUrls: ['./site-work-master-detail.component.scss'],
})
export class SiteWorkMasterDetailComponent  implements OnInit {
  Entity: SiteWorkMaster = SiteWorkMaster.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Site Work Master' | 'Edit Site Work Master' = 'New Site Work Master';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SiteWorkMaster = null as any;
  SiteWorkGroupList: SiteWorkGroup[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  NameWithNos: string = ValidationPatterns.NameWithNos
  
  NameWithNosMsg: string = ValidationMessages.NameWithNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
 
  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('CodeCtrl') CodeInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) {}

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.SiteWorkGroupList = await SiteWorkGroup.FetchEntireList();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Site Work Master'
        : 'Edit Site Work Master';
      this.Entity = SiteWorkMaster.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.Entity = SiteWorkMaster.CreateNewInstance();
      SiteWorkMaster.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      SiteWorkMaster.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SiteWorkMaster;
    // this.focusInput();

  }

 
  SaveSiteWorkMaster = async () => {
    this.Entity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName =
      this.companystatemanagement.getCurrentCompanyName();
    let entityToSave = this.Entity.GetEditableVersion();
    console.log('entityToSave :', entityToSave);

    let entitiesToSave = [entityToSave];
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error',tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Site Work Master  saved successfully!'
        );
        this.Entity = SiteWorkMaster.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster(
          'Site Work Master  Updated successfully!'
        );
        await this.router.navigate(['/homepage/Website/Site_Work_Master']);
      }
    }
  };

  BackSiteWorkMaster() {
    this.router.navigate(['/homepage/Website/Site_Work_Master']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.CodeInputControl.control.markAsUntouched();
  
    // reset dirty
  
    this.NameInputControl.control.markAsPristine();
    this.CodeInputControl.control.markAsPristine();
  }
}
