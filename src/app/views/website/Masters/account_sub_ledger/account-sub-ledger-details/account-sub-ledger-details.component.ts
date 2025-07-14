import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-account-sub-ledger-details',
  standalone: false,
  templateUrl: './account-sub-ledger-details.component.html',
  styleUrls: ['./account-sub-ledger-details.component.scss'],
})
export class AccountSubLedgerDetailsComponent implements OnInit {
  Entity: SubLedger = SubLedger.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Sub Ledger' | 'Edit Sub Ledger' = 'New Sub Ledger';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SubLedger = null as any;
  LedgerList: Ledger[] = [];
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
      this.DetailsFormTitle = this.IsNewEntity ? 'New Sub Ledger' : 'Edit Sub Ledger';
      this.Entity = SubLedger.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      console.log('Entity :', this.Entity);
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = SubLedger.CreateNewInstance();
      SubLedger.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      SubLedger.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SubLedger;
    this.FormulateLedgerList();
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('LedgerRef')!;
    txtName.focus();
  }

  public FormulateLedgerList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst
  };

  SaveSubLedgerMaster = async () => {
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
        await this.uiUtils.showSuccessToster('SubLedger saved successfully');
        this.Entity = SubLedger.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('SubLedger Updated successfully');
        await this.router.navigate(['/homepage/Website/Account_Sub_Ledger']);
      }
    }
  };


  BackSubLedger = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Sub Ledger Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Account_Sub_Ledger']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Account_Sub_Ledger']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }
}
