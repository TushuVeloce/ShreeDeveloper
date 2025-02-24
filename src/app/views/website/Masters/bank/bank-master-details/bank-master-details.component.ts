import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bank } from 'src/app/classes/domain/entities/website/masters/bank/bank';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-bank-master-details',
  standalone: false,
  templateUrl: './bank-master-details.component.html',
  styleUrls: ['./bank-master-details.component.scss'],
})
export class BankMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: Bank = Bank.CreateNewInstance();
  DetailsFormTitle: 'New Bank' | 'Edit Bank' = 'New Bank';
  InitialEntity: Bank = null as any;
  CompanyList: Company[] = [];

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }


  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.CompanyList = await Company.FetchEntireList();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Bank' : 'Edit Bank';
      this.Entity = Bank.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Bank.CreateNewInstance();
      Bank.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(Bank.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as Bank;
  }

  SaveBankMaster = async () => {
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Bank saved successfully!');
        this.Entity = Bank.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Bank Updated successfully!');
      }
    }
  }


  BackBank() {
    this.router.navigate(['/homepage/Website/Bank_Master']);
  }

}
