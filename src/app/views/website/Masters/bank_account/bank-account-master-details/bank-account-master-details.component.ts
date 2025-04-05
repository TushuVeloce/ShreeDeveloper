import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-bank-account-master-details',
  standalone: false,
  templateUrl: './bank-account-master-details.component.html',
  styleUrls: ['./bank-account-master-details.component.scss'],
})
export class BankAccountMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: BankAccount = BankAccount.CreateNewInstance();
  DetailsFormTitle: 'New Bank Account' | 'Edit Bank Account' = 'New Bank Account';
  InitialEntity: BankAccount = null as any;
  dateofopening: string | null = null;


  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private dtu: DTU,
      private datePipe: DatePipe, ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Bank Account' : 'Edit Bank Account';
      this.Entity = BankAccount.GetCurrentInstance();

      // While Edit Converting date String into Date Format //
      this.dateofopening = this.datePipe.transform(
        this.dtu.FromString(this.Entity.p.DateofOpening),
        'yyyy-MM-dd'
      );
      this.appStateManage.StorageKey.removeItem('Editable')
    } else {
      this.Entity = BankAccount.CreateNewInstance();
      BankAccount.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(BankAccount.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as BankAccount;
  }

  SaveBankAccountMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
     // ------ Code For Save Date Of InCorporation Year Format ---------------//
     if (this.dateofopening) {
      let dateValue = new Date(this.dateofopening);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.DateofOpening =
          this.dtu.DateStartStringFromDateValue(dateValue);
      } else {
        entityToSave.p.DateofOpening = '';
      }
    }
    let entitiesToSave = [entityToSave]
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error',tr.Message)
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Bank Account saved successfully!');
        this.dateofopening = '';
        this.Entity = BankAccount.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Bank Account Updated successfully!');
        await this.router.navigate(['/homepage/Website/Bank_Account_Master']);

      }
    }
  }


  BackBankAccount = () => {
    this.router.navigate(['/homepage/Website/Bank_Account_Master']);
  }

}
