import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums, ModeOfPayments, PayerTypes, RecipientTypes, } from 'src/app/classes/domain/domainenums/domainenums';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
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
  selector: 'app-income-details',
  standalone: false,
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.scss'],
})
export class IncomeDetailsComponent implements OnInit {
  Entity: Income = Income.CreateNewInstance();
  PayerEntity: Payer = Payer.CreateNewInstance();

  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  SubLedgerList: SubLedger[] = [];
  ShreeBalance: number = 0;
  UnitList: Unit[] = [];
  PayerList: Income[] = [];
  PayerNameInput: boolean = false
  PayerNameReadOnly: boolean = false
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Income' | 'Edit Income' = 'New Income';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Income = null as any;
  LedgerList: Ledger[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  BankList: OpeningBalance[] = [];
  Cash = ModeOfPayments.Cash
  Bill = ModeOfPayments.Bill
  RecipientType = RecipientTypes.Recipient
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref !== this.Bill);
  PayerTypesList = DomainEnums.PayerTypesList();
  DealDoneCustomer = PayerTypes.DealDoneCustomer;

  Date: string = '';

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

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
    this.FormulateBankList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Income' : 'Edit Income';
      this.Entity = Income.GetCurrentInstance();
      this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
      this.appStateManage.StorageKey.removeItem('Editable');
      await this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = Income.CreateNewInstance();
      Income.SetCurrentInstance(this.Entity);
      let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      this.Date = strCDT.substring(0, 10);
    }

    this.getPayerListByPayerType()
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
  }

  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UnitList = lst;
  }

  public FormulateBankList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.BankList = lst.filter((item) => item.p.BankAccountRef > 0 && item.p.OpeningBalanceAmount > 0)
  };

  OnModeChange = () => {
    this.Entity.p.BankAccountRef = 0
  }

  CalculateShreeBalance = () => {
    this.Entity.p.ShreesBalance = this.ShreeBalance + this.Entity.p.IncomeAmount;
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
    this.ShreeBalance = lst[0].p.ShreesBalance;
  }

  getPayerListByPayerType = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.PayerType <= 0) {
      // await this.uiUtils.showErrorToster('Payer Type not Selected');
      return;
    }
    let lst = await Income.FetchPayerNameByPayerTypeRef(this.Entity.p.SiteRef,this.companyRef(), this.Entity.p.PayerType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.PayerList = lst;
  }

  onPayerChange = () => {
    try {
      let SingleRecord = this.PayerList.find((data) => data.p.Ref == this.Entity.p.PayerRef);
      if (SingleRecord?.p) {
        this.Entity.p.IsRegisterCustomerRef = SingleRecord.p.IsRegisterCustomerRef;
        if (this.Entity.p.PayerType == this.DealDoneCustomer) {
          this.Entity.p.PlotName = SingleRecord.p.PlotName;
        }
      }
    } catch (error) {

    }
  }

  AddPayerName = () => {
    this.Entity.p.PayerRef = 0
    this.PayerEntity.p.Name = ''
    this.PayerNameInput = true
  }

  cancelPayerName = () => {
    this.PayerNameInput = false
    this.PayerEntity.p.Name = ''
  }

  SaveNewPayerName = async () => {
    if (this.PayerEntity.p.Name == '') {
      this.uiUtils.showErrorToster('Payer Name can not be Blank');
      return
    }
    this.PayerEntity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.PayerEntity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.PayerEntity.p.CreatedBy == 0) {
      this.PayerEntity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.PayerEntity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
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
        this.PayerNameInput = false
        await this.getPayerListByPayerType()
        this.PayerEntity = Payer.CreateNewInstance();
      }
    }
  };


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

   onTypeChange = () =>{
    this.Entity.p.PayerRef = 0;
    this.PayerNameInput = false
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
}

