import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums, ModeOfPayments, OpeningBalanceModeOfPayments, RecipientTypes, TypeOfEmployeePayments, } from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { Recipient } from 'src/app/classes/domain/entities/website/masters/recipientname/recipientname';
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
  selector: 'app-expense-details',
  standalone: false,
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent implements OnInit {
  Entity: Expense = Expense.CreateNewInstance();
  RecipientEntity: Recipient = Recipient.CreateNewInstance();
  RecipientList: Invoice[] = [];
  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  LedgerList: Ledger[] = [];
  SubLedgerList: SubLedger[] = [];
  IncomeSubLedgerList: SubLedger[] = [];
  UnitList: Unit[] = [];
  RecipientNameInput: boolean = false
  isSaveDisabled: boolean = false;
  ShreeBalance: number = 0;
  PaymentType: number = 0;
  DetailsFormTitle: 'New Expense' | 'Edit Expense' = 'New Expense';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Expense = null as any;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  BankList: OpeningBalance[] = [];
  Cash = ModeOfPayments.Cash
  Bill = ModeOfPayments.Bill
  RecipientType = RecipientTypes.Recipient
  SiteType = RecipientTypes.Sites
  EmployeeType = RecipientTypes.Employee
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref !== this.Bill);
  TypeofEmployeePaymentList = DomainEnums.TypeOfEmployeePaymentsList();
  TypeofEmployeePayments = TypeOfEmployeePayments;
  RecipientTypesList = DomainEnums.RecipientTypesList();
  Employee = RecipientTypes.Employee;
  Sites = RecipientTypes.Sites;
  Date: string = '';

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('ReasonCtrl') ReasonInputControl!: NgModel;
  @ViewChild('NarrationCtrl') NarrationInputControl!: NgModel;

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
      this.DetailsFormTitle = this.IsNewEntity ? 'New Expense' : 'Edit Expense';
      this.Entity = Expense.GetCurrentInstance();
      if (this.Entity.p.IsAdvancePayment && this.Entity.p.IsSalaryExpense) {
        this.PaymentType = this.TypeofEmployeePayments.Advance;
      } else if (!this.Entity.p.IsAdvancePayment && this.Entity.p.IsSalaryExpense) {
        this.PaymentType = this.TypeofEmployeePayments.Salary;
      } else {
        this.PaymentType = this.TypeofEmployeePayments.Other;
      }

      this.Date = this.Entity.p.Date;
      this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
      this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.Entity.p.IncomeLedgerRef != 0) {
        this.getSubIncomeLedgerListByIncomeLedgerRef(this.Entity.p.IncomeLedgerRef)
      }
      if (this.Entity.p.RecipientType != 0) {
        this.getRecipientListByRecipientTypeRef()
      }
    } else {
      this.Entity = Expense.CreateNewInstance();
      Expense.SetCurrentInstance(this.Entity);
      let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      this.Date = strCDT.substring(0, 10);
    }
    this.getCurrentBalanceByCompanyRef();
    this.InitialEntity = Object.assign(
      Expense.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Expense;
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

  onPaymentTypeSelection = () => {
    if (this.PaymentType == this.TypeofEmployeePayments.Advance) {
      this.Entity.p.IsAdvancePayment = 1;
      this.Entity.p.IsSalaryExpense = true;
    } else if (this.PaymentType == this.TypeofEmployeePayments.Salary) {
      this.Entity.p.IsAdvancePayment = 0;
      this.Entity.p.IsSalaryExpense = true;
    } else {
      this.Entity.p.IsAdvancePayment = 0;
      this.Entity.p.IsSalaryExpense = false;
    }
  }

  OnModeChange = () => {
    this.Entity.p.BankAccountRef = 0
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

  getSubIncomeLedgerListByIncomeLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.IncomeSubLedgerList = lst;
  }

  getRecipientListByRecipientTypeRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      await this.uiUtils.showErrorToster('To Whom not Selected');
      return;
    }

    this.RecipientList = [];
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(this.companyRef(), this.Entity.p.RecipientType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.RecipientList = lst;
  }

  onTypeChange = async () => {
    this.Entity.p.IncomeLedgerRef = 0;
    this.Entity.p.IncomeSubLedgerRef = 0;
    this.PaymentType = 0;
    this.Entity.p.RecipientRef = 0;
    this.Entity.p.Reason = '';
    this.Entity.p.IsAdvancePayment = 0;
    this.Entity.p.IsSalaryExpense = false;
    this.Entity.p.TotalAdvance = 0;
    this.Entity.p.RemainingAdvance = 0;
    this.Entity.p.InvoiceAmount = 0;
    this.Entity.p.RemainingAmount = 0;
    this.Entity.p.GivenAmount = 0
    this.Entity.p.BankAccountRef = 0
    this.Entity.p.Narration = '';
    this.Entity.p.ExpenseModeOfPayment = 0;
    this.Entity.p.IsAutoInvoiceEnabled = 0;
    this.RecipientNameInput = false
  }

  onChangeIncomeLedger = () => {
    this.Entity.p.IncomeSubLedgerRef = 0;
  }

  getTotalInvoiceAmountFromSiteAndRecipientRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      // await this.uiUtils.showErrorToster('To Whom not Selected');
      return;
    }
    if (this.Entity.p.RecipientRef <= 0) {
      // await this.uiUtils.showErrorToster('Recipient not Selected');
      return;
    }

    if (this.PaymentType <= 0 && this.Entity.p.ExpenseModeOfPayment == this.Employee) {
      await this.uiUtils.showErrorToster('Payment Type not Selected');
      return;
    }


    let lst = await Expense.FetchTotalInvoiceAmountFromSiteAndRecipient(this.companyRef(), this.Entity.p.SiteRef, this.Entity.p.RecipientType, this.Entity.p.RecipientRef, this.Entity.p.IsSalaryExpense, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      if (lst[0].p.InvoiceAmount < 0) {
        this.Entity.p.InvoiceAmount = 0;
      } else {
        this.Entity.p.InvoiceAmount = lst[0].p.InvoiceAmount;
      }
      this.Entity.p.RemainingAdvance = lst[0].p.RemainingAdvance;
    }
    // this.RecipientList = lst;
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    if (lst.length > 0) {
      this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
      this.ShreeBalance = lst[0].p.ShreesBalance;
    }
  }

  onRecipientChange = () => {
    this.PaymentType = 0;
    this.Entity.p.Reason = '';
    this.Entity.p.IsAdvancePayment = 0;
    this.Entity.p.IsSalaryExpense = false;
    this.Entity.p.TotalAdvance = 0;
    this.Entity.p.RemainingAdvance = 0;
    this.Entity.p.InvoiceAmount = 0;
    this.Entity.p.RemainingAmount = 0;
    this.Entity.p.GivenAmount = 0
    this.Entity.p.BankAccountRef = 0
    this.Entity.p.Narration = '';
    this.Entity.p.ExpenseModeOfPayment = 0;
    this.Entity.p.IsAutoInvoiceEnabled = 0;
    this.RecipientNameInput = false
    try {
      let SingleRecord = this.RecipientList.find((data) => data.p.Ref == this.Entity.p.RecipientRef);;
      if (SingleRecord?.p) {
        this.Entity.p.IsSiteRef = SingleRecord.p.IsSiteRef;
      }
    } catch (error) {

    }
  }

  CalculateRemainingAmountandBalance = () => {
    if (this.Entity.p.GivenAmount <= this.Entity.p.InvoiceAmount) {
      this.Entity.p.RemainingAmount = Number((this.Entity.p.InvoiceAmount - this.Entity.p.GivenAmount).toFixed(2));
    } else {
      this.Entity.p.RemainingAmount = 0;
    }
    if (this.Entity.p.RecipientType == this.SiteType) {
      this.getCurrentBalanceByCompanyRef()
      return
    }
    if (this.Entity.p.GivenAmount <= this.Entity.p.ShreesBalance) {
      this.Entity.p.ShreesBalance = Number((this.ShreeBalance - this.Entity.p.GivenAmount).toFixed(2));
    } else {
      this.Entity.p.ShreesBalance = -Number((this.Entity.p.GivenAmount - this.ShreeBalance).toFixed(2));
    }
    if (this.Entity.p.IsAdvancePayment) {
      this.Entity.p.TotalAdvance = this.Entity.p.RemainingAdvance + this.Entity.p.GivenAmount
    }
  }

  AddRecipientName = () => {
    this.Entity.p.RecipientRef = 0
    this.RecipientEntity.p.Name = ''
    this.RecipientNameInput = true
  }

  cancelRecipientName = () => {
    this.RecipientNameInput = false
    this.RecipientEntity.p.Name = ''
  }

  SaveRecipientName = () => {
    this.RecipientNameInput = false
    this.Entity.p.RecipientName = ''
  }

  SaveNewRecipientName = async () => {
    if (this.RecipientEntity.p.Name == '') {
      this.uiUtils.showErrorToster('Recipient Name can not be Blank');
      return
    }
    this.RecipientEntity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.RecipientEntity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.RecipientEntity.p.CreatedBy == 0) {
      this.RecipientEntity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.RecipientEntity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.RecipientEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      await this.uiUtils.showSuccessToster('Recipient Name saved successfully');
      this.RecipientNameInput = false
      this.RecipientEntity = Recipient.CreateNewInstance();
      await this.getRecipientListByRecipientTypeRef()
    }
  };

  SaveExpense = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
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
        await this.uiUtils.showSuccessToster('Expense saved successfully');
        this.Entity = Expense.CreateNewInstance();
        this.PaymentType = 0
        await this.getCurrentBalanceByCompanyRef()
      } else {
        await this.uiUtils.showSuccessToster('Expense Updated successfully');
        await this.router.navigate(['/homepage/Website/Expense']);
      }
    }
  };

  IsAdvancePayment = async () => {
    if (this.Entity.p.IsAdvancePayment == 1) {
      this.Entity.p.InvoiceAmount = 0
    } else {
      await this.getTotalInvoiceAmountFromSiteAndRecipientRef()
    }
    this.Entity.p.GivenAmount = 0
    this.Entity.p.TotalAdvance = 0
  }


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackExpense = async () => {
    await this.router.navigate(['/homepage/Website/Expense']);
  }
}

