import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Owner } from 'src/app/classes/domain/entities/website/masters/ownermaster/owner';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-owner-master-details',
  standalone: false,
  templateUrl: './owner-master-details.component.html',
  styleUrls: ['./owner-master-details.component.scss'],
})
export class OwnerMasterDetailsComponent  implements OnInit {
Entity: Owner = Owner.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Owner Name' | 'Edit Owner Name' = 'New Owner Name';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Owner = null as any;
  isAdd = false;

  companyRef = this.companystatemanagement.SelectedCompanyRef;


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
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.IsDropdownDisabled = true;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Owner Name'
        : 'Edit Owner Name';
      this.Entity = Owner.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = Owner.CreateNewInstance();
      Owner.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(Owner.CreateNewInstance(),this.utils.DeepCopy(this.Entity))as Owner;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  SaveOwnerMaster = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
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
        await this.uiUtils.showSuccessToster('Owner Name saved successfully');
        this.Entity = Owner.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Owner Name Updated successfully');
        await this.router.navigate(['/homepage/Website/Owner_Master']);
      }
    }
  };

  BackOwner = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Owner Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Owner_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Owner_Master']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty

    this.NameInputControl.control.markAsPristine();
  }
}

