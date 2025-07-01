import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-account-main-ledger-details',
  standalone: false,
  templateUrl: './account-main-ledger-details.component.html',
  styleUrls: ['./account-main-ledger-details.component.scss'],
})
export class AccountMainLedgerDetailsComponent implements OnInit {
  Entity: Ledger = Ledger.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Ledger' | 'Edit Ledger' = 'New Ledger';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Ledger = null as any;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
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
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Ledger' : 'Edit Ledger';
      this.Entity = Ledger.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = Ledger.CreateNewInstance();
      Ledger.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Ledger.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Ledger;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Code')!;
    txtName.focus();
  }

  SaveLedgerMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Ledger saved successfully');
        this.Entity = Ledger.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Ledger Updated successfully');
        await this.router.navigate(['/homepage/Website/Account_Main_Ledger']);
      }
    }
  };


  BackLedger = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Ledger Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Account_Main_Ledger']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Account_Main_Ledger']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }
}
