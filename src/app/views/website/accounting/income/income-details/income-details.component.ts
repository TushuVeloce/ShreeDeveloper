import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums, } from 'src/app/classes/domain/domainenums/domainenums';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-income-details',
  standalone: false,
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.scss'],
})
export class IncomeDetailsComponent implements OnInit {
  Entity: Income = Income.CreateNewInstance();
  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  SubLedgerList: SubLedger[] = [];
  UnitList: Unit[] = [];
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Income' | 'Edit Income' = 'New Income';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Income = null as any;
  LedgerList: Ledger[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  Date: string = '';

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.getUnitList();
    await this.getSiteListByCompanyRef();
    await this.getLedgerListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Income' : 'Edit Income';
      this.Entity = Income.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = Income.CreateNewInstance();
      Income.SetCurrentInstance(this.Entity);
      let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      this.Date = strCDT.substring(0, 10);
    }
    this.InitialEntity = Object.assign(
      Income.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Income;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Date')!;
    txtName.focus();
  }

  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UnitList = lst;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.SubLedgerRef = 0
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubLedgerList = lst;
  }

  SaveIncome = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Date);
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
        await this.uiUtils.showSuccessToster('Income saved successfully');
        this.Entity = Income.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Income Updated successfully');
        await this.router.navigate(['/homepage/Website/Income']);
      }
    }
  };

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackIncome = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Income Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Income']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Income']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }
}

