import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { ValidationMessages, ValidationPatterns, } from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { SiteWorkDone } from 'src/app/classes/domain/entities/website/government_office/siteworkdone/siteworkdone';
import { SiteWorkMaster } from 'src/app/classes/domain/entities/website/government_office/siteworkmaster/siteworkmaster';

@Component({
  selector: 'app-site-work-done-master-details',
  templateUrl: './site-work-done-master-details.component.html',
  styleUrls: ['./site-work-done-master-details.component.scss'],
  standalone: false,
})
export class SiteWorkDoneMasterDetailsComponent implements OnInit {
  Entity: SiteWorkDone = SiteWorkDone.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Site Work Done' | 'Edit Site Work Done' =
    'New Site Work Done';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SiteWorkDone = null as any;
  SiteWorkGroupList: SiteWorkGroup[] = [];
  SiteWorkMasterList: SiteWorkMaster[] = [];
  DisplaySiteWorkMasterList: SiteWorkMaster[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  NameWithNos: string = ValidationPatterns.NameWithNos;

  NameWithNosMsg: string = ValidationMessages.NameWithNosMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  ApplicableTypesForSites = DomainEnums.ApplicableTypesForSiteList(
    true,
    '--Select Applicable Types--'
  );

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('CodeCtrl') CodeInputControl!: NgModel;

  SiteGroupRef: number = 0;
  SiteGroupName: string = '';

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    const SiteGroupRef = this.appStateManage.StorageKey.getItem('siteRf');
    const sitegroupName = this.appStateManage.StorageKey.getItem('siteName');
    this.SiteGroupRef = SiteGroupRef ? Number(SiteGroupRef) : 0;
    this.SiteGroupName = sitegroupName ? sitegroupName : '';
    this.SiteWorkGroupList = await SiteWorkGroup.FetchEntireList();
    this.SiteWorkMasterList = await SiteWorkMaster.FetchEntireList();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Site Work Done'
        : 'Edit Site Work Done';
      this.Entity = SiteWorkDone.GetCurrentInstance();
      this.SiteGroupRef = this.Entity.p.SiteWorkGroupRef
      this.DisplaySiteWorkMasterList = this.SiteWorkMasterList.filter(e => e.p.SiteWorkGroupRef == this.Entity.p.SiteWorkGroupRef)

      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.Entity = SiteWorkDone.CreateNewInstance();
      SiteWorkDone.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      SiteWorkDone.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SiteWorkDone;
    // this.focusInput();
  }

  onApplicableTypeChange(selectedvalue: any) {
    this.Entity.p.ListOfApplicableTypes = selectedvalue;
  }

  onSiteGroupChange(siteGroupRef: number) {
    this.DisplaySiteWorkMasterList = [];
    this.Entity.p.SiteWorkRef = 0;
    if (siteGroupRef > 0) {
      // this.Entity.p.SiteWorkGroupRef = sitework;
      // const selectedSiteWorkref = this.SiteWorkMasterList.find(
      //   (site) => site.p.Ref === sitework
      // );
      // if (!selectedSiteWorkref) {
      //   return;
      // }
      this.DisplaySiteWorkMasterList = this.SiteWorkMasterList.filter(e => e.p.SiteWorkGroupRef == siteGroupRef)
    }
  }

  SaveSiteWorkDone = async () => {
    this.Entity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName =
      this.companystatemanagement.getCurrentCompanyName();
    let entityToSave = this.Entity.GetEditableVersion();

    let entitiesToSave = [entityToSave];
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Site Work Done saved successfully'
        );
        this.Entity = SiteWorkDone.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster(
          'Site Work Done Updated successfully'
        );
        await this.router.navigate(['/homepage/Website/Site_Work_Done']);
      }
    }
  };

  BackSiteWorkDone = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Site Work Done Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Site_Work_Done']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Site_Work_Done']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.CodeInputControl.control.markAsUntouched();

    // reset dirty

    this.NameInputControl.control.markAsPristine();
    this.CodeInputControl.control.markAsPristine();
  };
}
