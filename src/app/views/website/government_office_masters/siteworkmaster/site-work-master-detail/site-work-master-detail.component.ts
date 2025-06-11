import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import {
  ValidationMessages,
  ValidationPatterns,
} from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';
import { SiteWorkMaster } from 'src/app/classes/domain/entities/website/government_office/siteworkmaster/siteworkmaster';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';

@Component({
  selector: 'app-site-work-master-detail',
  standalone: false,
  templateUrl: './site-work-master-detail.component.html',
  styleUrls: ['./site-work-master-detail.component.scss'],
})
export class SiteWorkMasterDetailComponent implements OnInit {
  Entity: SiteWorkMaster = SiteWorkMaster.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Site Work Master' | 'Edit Site Work Master' =
    'New Site Work Master';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SiteWorkMaster = null as any;
  SiteWorkGroupList: SiteWorkGroup[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;
  InputNumber: string = ValidationPatterns.InputNumber;
  InputNumberMsg: string = ValidationMessages.InputNumberMsg;

  SiteWorkApplicableTypes = DomainEnums.ApplicableTypesForSiteList(
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
    this.FormulateSiteWorkGroupListByCompanyRef()
    this.appStateManage.setDropdownDisabled(true);
    // const SiteGroupRef = this.appStateManage.StorageKey.getItem('sitegroup');
    // this.Entity.p.SiteWorkGroupRef = SiteGroupRef ? Number(SiteGroupRef) : 0;
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
      const SiteWorkGroupRef = Number(this.appStateManage.StorageKey.getItem('sitegroup'))
      if (SiteWorkGroupRef) {
        this.Entity.p.SiteWorkGroupRef = SiteWorkGroupRef
      }
    }
    this.InitialEntity = Object.assign(
      SiteWorkMaster.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SiteWorkMaster;
  }

  onSiteWorkDone = () => {
    this.appStateManage.StorageKey.setItem('sitegroup', String(this.Entity.p.SiteWorkGroupRef));
  }

  private FormulateSiteWorkGroupListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SiteWorkGroup.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteWorkGroupList = lst.sort((a, b) => a.p.DisplayOrder - b.p.DisplayOrder);

  };

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }


  SaveSiteWorkMaster = async () => {
    this.Entity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName =
      this.companystatemanagement.getCurrentCompanyName();
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
        await this.uiUtils.showSuccessToster(
          'Site Work Master saved successfully'
        );
        // this.Entity = SiteWorkMaster.CreateNewInstance();
        this.Entity.p.Name = ''
        this.Entity.p.DisplayOrder = 0
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster(
          'Site Work Master Updated successfully'
        );
        await this.router.navigate(['/homepage/Website/Site_Work_Master']);
      }
    }
  };

  BackSiteWorkMaster = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Site Work Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Site_Work_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Site_Work_Master']);
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
