import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Payer } from 'src/app/classes/domain/entities/website/masters/payer/payer';
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
  selector: 'app-income-details-mobile',
  templateUrl: './income-details-mobile.page.html',
  styleUrls: ['./income-details-mobile.page.scss'],
  standalone: false,
})
export class IncomeDetailsMobilePage implements OnInit {
  Entity: Income = Income.CreateNewInstance();
  PayerEntity: Payer = Payer.CreateNewInstance();

  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  SubLedgerList: SubLedger[] = [];
  ShreeBalance: number = 0;
  UnitList: Unit[] = [];
  PayerList: Payer[] = [];
  PayerNameInput: boolean = false;
  PayerNameReadOnly: boolean = false;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Income' | 'Edit Income' = 'New Income';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Income = null as any;
  LedgerList: Ledger[] = [];
  // companyRef = this.companystatemanagement.SelectedCompanyRef;
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList();
  Date: string = '';

  companyRef = 0;

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement
  ) {}

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    const company =
      this.appStateManage.localStorage.getItem('SelectedCompanyRef');
    this.companyRef = Number(company || 0);

    await this.getUnitList();
    await this.getSiteListByCompanyRef();
    await this.getLedgerListByCompanyRef();
    if (this.appStateManage.localStorage.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Income' : 'Edit Income';
      this.Entity = Income.GetCurrentInstance();
      this.appStateManage.localStorage.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
    } else {
      this.Entity = Income.CreateNewInstance();
      Income.SetCurrentInstance(this.Entity);
      let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      this.Date = strCDT.substring(0, 10);
    }

    this.getPayerListByCompanyRef();
    this.getCurrentBalanceByCompanyRef();
    this.InitialEntity = Object.assign(
      Income.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Income;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Date')!;
    txtName.focus();
  };

  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.UnitList = lst;
  };

  CalculateShreeBalance = () => {
    this.Entity.p.ShreesBalance =
      this.ShreeBalance + this.Entity.p.IncomeAmount;
  };

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
    this.ShreeBalance = lst[0].p.ShreesBalance;
  };

  getPayerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Payer.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.PayerList = lst;
  };

  AddPayerName = () => {
    this.Entity.p.PayerRef = 0;
    this.PayerEntity.p.Name = '';
    this.PayerNameInput = true;
  };

  cancelPayerName = () => {
    this.PayerNameInput = false;
    this.PayerEntity.p.Name = '';
  };

  SaveNewPayerName = async () => {
    if (this.PayerEntity.p.Name == '') {
      this.uiUtils.showErrorToster('Payer Name can not be Blank');
      return;
    }
    this.PayerEntity.p.CompanyRef =
      this.companystatemanagement.getCurrentCompanyRef();
    this.PayerEntity.p.CompanyName =
      this.companystatemanagement.getCurrentCompanyName();
    if (this.PayerEntity.p.CreatedBy == 0) {
      this.PayerEntity.p.CreatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
      this.PayerEntity.p.UpdatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
    }
    let entityToSave = this.PayerEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Payer Name saved successfully');
        this.PayerNameInput = false;
        await this.getPayerListByCompanyRef();
        this.PayerEntity = Payer.CreateNewInstance();
      }
    }
  };

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
  };

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.Entity.p.SubLedgerRef = 0;
    let lst = await Ledger.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst;
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(
      ledgerref,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SubLedgerList = lst;
  };

  SaveIncome = async () => {
    this.Entity.p.CompanyRef =this.companyRef;
    this.Entity.p.CompanyName =
      this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
    }
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Date);
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
        await this.uiUtils.showSuccessToster('Income saved successfully');
        this.Entity = Income.CreateNewInstance();
        this.getCurrentBalanceByCompanyRef();
      } else {
        await this.uiUtils.showSuccessToster('Income Updated successfully');
        await this.router.navigate([
          '/mobileapp/tabs/dashboard/accounting/income',
        ]);
      }
    }
  };

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackIncome = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage(
        'Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Income Form?`,
        async () => {
          await this.router.navigate([
            '/mobileapp/tabs/dashboard/accounting/income',
          ]);
        }
      );
    } else {
      await this.router.navigate([
        '/mobileapp/tabs/dashboard/accounting/income',
      ]);
    }
  };
}
