import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, ModeOfPayments, RecipientTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Recipient } from 'src/app/classes/domain/entities/website/masters/recipientname/recipientname';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-expenses-details-mobile-app',
  templateUrl: './expenses-details-mobile-app.component.html',
  styleUrls: ['./expenses-details-mobile-app.component.scss'],
  standalone: false
})
export class ExpensesDetailsMobileAppComponent implements OnInit {
  Entity: Expense = Expense.CreateNewInstance();
  RecipientEntity: Recipient = Recipient.CreateNewInstance();
  RecipientList: Invoice[] = [];
  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  SubLedgerList: SubLedger[] = [];
  IncomeSubLedgerList: SubLedger[] = [];
  UnitList: Unit[] = [];
  RecipientNameInput: boolean = false
  isSaveDisabled: boolean = false;
  ShreeBalance: number = 0;
  DetailsFormTitle: 'New Expense' | 'Edit Expense' = 'New Expense';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Expense = null as any;
  LedgerList: Ledger[] = [];
  companyRef = 0;
  BankList: BankAccount[] = [];
  Cash = ModeOfPayments.Cash
  Bill = ModeOfPayments.Bill
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref !== this.Bill);
  RecipientTypesList = DomainEnums.RecipientTypesList();
  payerTypeRecipient = RecipientTypes.Recipient;
  Employee = RecipientTypes.Employee;
  Sites = RecipientTypes.Sites;
  Date: string = '';


  showExpenseDatePicker = false;
  ExpenseDate = '';
  DisplayExpenseDate = '';

  LedgerName: string = '';
  selectedLedger: any[] = [];

  SubLedgerName: string = '';
  selectedSubLedger: any[] = [];

  selectedIncomeSubLedger: any[] = [];
  IncomeSubLedgerName: string = '';

  selectedIncomeLedger: any[] = [];
  IncomeLedgerName: string = '';

  selectedToWhomType: any[] = [];
  ToWhomTypeName: string = '';

  RecipientName: string = '';
  selectedRecipientName: any[] = [];

  selectedSite: any[] = [];
  SiteName: string = '';

  ModeOfPaymentName: string = '';
  selectedModeOfPayment: any[] = [];

  BankName: string = '';
  selectedBank: any[] = [];



  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utils: Utils,
    private datePipe: DatePipe,
  ) { }

  ngOnInit = async () => {
    await this.loadInvoiceDetailsIfCompanyExists();

  }
  ionViewWillEnter = async () => {
    await this.loadInvoiceDetailsIfCompanyExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  private async loadInvoiceDetailsIfCompanyExists() {
    try {
      await this.loadingService.show(); // Awaiting this is critical
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef > 0) {
        this.appStateManage.setDropdownDisabled(true);
        await this.getUnitList();
        await this.getSiteListByCompanyRef();
        await this.getLedgerListByCompanyRef();
        this.FormulateBankList();
        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Expense' : 'Edit Expense';
          this.Entity = Expense.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable');

          this.selectedSite = [{ p: { Ref: this.Entity.p.SiteRef, Name: this.Entity.p.SiteName } }];
          this.SiteName = this.Entity.p.SiteName;

          this.selectedLedger = [{ p: { Ref: this.Entity.p.LedgerRef, Name: this.Entity.p.LedgerName } }];
          this.LedgerName = this.Entity.p.LedgerName;

          this.selectedSubLedger = [{ p: { Ref: this.Entity.p.SubLedgerRef, Name: this.Entity.p.SubLedgerName } }];
          this.SubLedgerName = this.Entity.p.SubLedgerName;

          this.ToWhomTypeName = this.RecipientTypesList.find(item => item.Ref == this.Entity.p.RecipientType)?.Name ?? '';
          this.selectedToWhomType = [{ p: { Ref: this.Entity.p.RecipientType, Name: this.ToWhomTypeName } }];

          this.selectedRecipientName = [{ p: { Ref: this.Entity.p.RecipientRef, Name: this.Entity.p.RecipientName } }];
          this.RecipientName = this.Entity.p.RecipientName;

          this.ModeOfPaymentName = this.ModeofPaymentList.find(item => item.Ref == this.Entity.p.ExpenseModeOfPayment)?.Name ?? '';
          this.selectedModeOfPayment = [{ p: { Ref: this.Entity.p.ExpenseModeOfPayment, Name: this.ModeOfPaymentName } }];

          // this.Date = this.Entity.p.Date;
          if (this.Entity.p.Date != '') {
            this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
            this.ExpenseDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
            this.DisplayExpenseDate = this.datePipe.transform(this.ExpenseDate, 'yyyy-MM-dd') ?? '';;
          }
          this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
          this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
         
          this.selectedIncomeLedger = [{ p: { Ref: this.Entity.p.IncomeLedgerRef, Name: this.Entity.p.IncomeLedgerName } }];
          this.IncomeLedgerName = this.Entity.p.IncomeLedgerName;

          this.selectedIncomeSubLedger = [{ p: { Ref: this.Entity.p.IncomeSubLedgerRef, Name: this.Entity.p.IncomeSubLedgerName } }];
          this.IncomeSubLedgerName = this.Entity.p.IncomeSubLedgerName;

          this.BankName = this.BankList.find(item => item.p.Ref == this.Entity.p.BankAccountRef)?.p.Name ?? '';
          this.selectedBank = [{ p: { Ref: this.Entity.p.BankAccountRef, Name: this.BankName } }];

        } else {
          this.Entity = Expense.CreateNewInstance();
          Expense.SetCurrentInstance(this.Entity);
          // let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          // this.Date = strCDT.substring(0, 10);
          let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = strCDT.substring(0, 16).split('-');
          strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
          this.Entity.p.Date = strCDT;
          this.ExpenseDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          this.DisplayExpenseDate = this.datePipe.transform(this.ExpenseDate, 'yyyy-MM-dd') ?? '';;
        }
        this.getCurrentBalanceByCompanyRef();
        this.InitialEntity = Object.assign(
          Expense.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as Expense;
      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading Invoice details:', error);
      await this.toastService.present('Failed to load Invoice details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }

  public async onExpenseDateChange(date: any): Promise<void> {
    console.log('this.ExpenseDate :', this.ExpenseDate);
    this.ExpenseDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.ExpenseDate;
    console.log('this.Entity.p.Date :', this.Entity.p.Date);
    this.DisplayExpenseDate = this.ExpenseDate;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }


  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.UnitList = lst;
  }

  public FormulateBankList = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await BankAccount.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.BankList = lst
  };

  OnModeChange = () => {
    this.Entity.p.BankAccountRef = 0
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.Entity.p.SubLedgerRef = 0
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      // await this.uiUtils.showErrorToster('Ledger not Selected');
      await this.toastService.present('Ledger not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SubLedgerList = lst;
  }

  getSubIncomeLedgerListByIncomeLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      // await this.uiUtils.showErrorToster('Ledger not Selected');
      await this.toastService.present('Ledger not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.IncomeSubLedgerList = lst;
  }

  getRecipientListByRecipientTypeRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      // await this.uiUtils.showErrorToster('To Whom not Selected');
      await this.toastService.present('To Whom not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.Entity.p.RecipientRef = 0;
    this.RecipientList = [];
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(this.companyRef, this.Entity.p.RecipientType, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.RecipientList = lst;
  }

  onTypeChange = () => {
    this.Entity.p.IncomeLedgerRef = 0;
    this.Entity.p.RecipientRef = 0;
    this.Entity.p.IsAdvancePayment = 0
  }

  onChangeIncomeLedger = () => {
    this.Entity.p.IncomeSubLedgerRef = 0;
  }

  getTotalInvoiceAmountFromSiteAndRecipientRef = async () => {
    if (this.companyRef <= 0) {
      // await this.toastService.present('company not selected', 1000, 'danger');
      // await this.haptic.error();
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Site not Selected');
      // await this.toastService.present('Site not Selected', 1000, 'danger');
      // await this.haptic.error();
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      // await this.uiUtils.showErrorToster('To Whom not Selected');
      // await this.toastService.present('To Whom not Selected', 1000, 'danger');
      // await this.haptic.error();
      return;
    }
    if (this.Entity.p.RecipientRef <= 0) {
      // await this.uiUtils.showErrorToster('Recipient not Selected');
      // await this.toastService.present('Recipient not Selected', 1000, 'danger');
      // await this.haptic.error();
      return;
    }
    let lst = await Expense.FetchTotalInvoiceAmountFromSiteAndRecipient(this.companyRef, this.Entity.p.SiteRef, this.Entity.p.RecipientType, this.Entity.p.RecipientRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
    if (lst.length > 0) {
      this.Entity.p.InvoiceAmount = lst[0].p.InvoiceAmount;
      this.Entity.p.RemainingAdvance = lst[0].p.RemainingAdvance;
    }
    // this.RecipientList = lst;
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    if (lst.length > 0) {
      this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
      this.ShreeBalance = lst[0].p.ShreesBalance;
    }
  }

  onRecipientChange = () => {
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
      this.Entity.p.RemainingAmount = this.Entity.p.InvoiceAmount - this.Entity.p.GivenAmount;
    } else {
      this.Entity.p.RemainingAmount = 0;
    }

    if (this.Entity.p.GivenAmount <= this.Entity.p.ShreesBalance) {
      this.Entity.p.ShreesBalance = this.ShreeBalance - this.Entity.p.GivenAmount;
    } else {
      this.Entity.p.ShreesBalance = -(this.Entity.p.GivenAmount - this.ShreeBalance);
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
      // this.uiUtils.showErrorToster('Recipient Name can not be Blank');
      await this.toastService.present('Recipient Name can not be Blank', 1000, 'danger');
      await this.haptic.error();
      return
    }
    this.RecipientEntity.p.CompanyRef = this.companyRef;
    this.RecipientEntity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.RecipientEntity.p.CreatedBy == 0) {
      this.RecipientEntity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
      this.RecipientEntity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.RecipientEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      // this.uiUtils.showErrorMessage('Error', tr.Message);
      await this.toastService.present('Error' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      // await this.uiUtils.showSuccessToster('Recipient Name saved successfully');
      await this.toastService.present('Recipient Name saved successfully', 1000, 'success');
      await this.haptic.success();
      this.RecipientNameInput = false
      this.RecipientEntity = Recipient.CreateNewInstance();
      await this.getRecipientListByRecipientTypeRef()
    }
  };

  SaveExpense = async () => {
    try {
      await this.loadingService.show();
      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
      if (this.Entity.p.CreatedBy == 0) {
        this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
        this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
      }
      this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.ExpenseDate);
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      console.log('entitiesToSave :', entitiesToSave);
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);

      if (!tr.Successful) {
        this.isSaveDisabled = false;
        // this.uiUtils.showErrorMessage('Error', tr.Message);
        await this.toastService.present('Error' + tr.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      } else {
        this.isSaveDisabled = false;
        if (this.IsNewEntity) {
          // await this.uiUtils.showSuccessToster('Expense saved successfully');
          await this.toastService.present('Expense saved successfully', 1000, 'success');
          await this.haptic.success();
          await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses']);
        } else {
          // await this.uiUtils.showSuccessToster('Expense Updated successfully');
          await this.toastService.present('Expense Updated successfully', 1000, 'success');
          await this.haptic.success();
          await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses']);
        }
      }
    } catch (error) {

    } finally {
      this.Entity = Expense.CreateNewInstance();
      await this.getCurrentBalanceByCompanyRef()
      await this.loadingService.hide();
    }
  };



  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  public async selectBankBottomsheet(): Promise<void> {
    try {
      const options = this.BankList;
      // console.log('options :', options);
      this.openSelectModal(options, this.selectedBank, false, 'Select Mode of Payment', 1, (selected) => {
        this.selectedBank = selected;
        this.Entity.p.BankAccountRef = selected[0].p.Ref;
        this.BankName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectModeOfPaymentBottomsheet(): Promise<void> {
    try {
      // const options = this.ModeofPaymentList;
      const options = this.ModeofPaymentList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedModeOfPayment, false, 'Select Mode of Payment', 1, (selected) => {
        this.selectedModeOfPayment = selected;
        this.Entity.p.ExpenseModeOfPayment = selected[0].p.Ref;
        this.ModeOfPaymentName = selected[0].p.Name;
        this.OnModeChange()
      });
    } catch (error) {

    }
  }

  public async selectRecipientNameBottomsheet(): Promise<void> {
    try {
      let options: any[] = [];
      if (options) {
        options = this.RecipientList.map(item => ({
          p: {
            Ref: item.p.Ref,
            Name: item.p.RecipientName
          }
        }));

      }
      // const options = this.RecipientList;
      console.log('RecipientList :', options);
      this.openSelectModal(options, this.selectedRecipientName, false, 'Select Recipient Name', 1, (selected) => {
        this.selectedRecipientName = selected;
        this.Entity.p.RecipientRef = selected[0].p.Ref;
        this.RecipientName = selected[0].p.Name;
        this.getTotalInvoiceAmountFromSiteAndRecipientRef();
        this.onRecipientChange();
      });
    } catch (error) {

    }
  }

  public async selectIncomeSubLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.IncomeSubLedgerList;
      this.openSelectModal(options, this.selectedIncomeSubLedger, false, 'Select Sub Ledger', 1, (selected) => {
        this.selectedIncomeSubLedger = selected;
        this.Entity.p.IncomeSubLedgerRef = selected[0].p.Ref;
        this.IncomeSubLedgerName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectIncomeLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.LedgerList;
      this.openSelectModal(options, this.selectedIncomeLedger, false, 'Select Income Ledger', 1, (selected) => {
        this.selectedIncomeLedger = selected;
        this.Entity.p.IncomeLedgerRef = selected[0].p.Ref;
        this.IncomeLedgerName = selected[0].p.Name;
        this.getSubIncomeLedgerListByIncomeLedgerRef(this.Entity.p.IncomeLedgerRef);
        this.onChangeIncomeLedger();
      });
    } catch (error) {

    }
  }

  public async selectToWhomTypeBottomsheet(): Promise<void> {
    try {
      // const options = this.RecipientTypesList;
      const options = this.RecipientTypesList.map((item) => ({ p: item }));
      console.log('options :', options);
      this.openSelectModal(options, this.selectedToWhomType, false, 'Select To Whom Type', 1, (selected) => {
        this.selectedToWhomType = selected;
        this.Entity.p.RecipientType = selected[0].p.Ref;
        this.ToWhomTypeName = selected[0].p.Name;
        this.getRecipientListByRecipientTypeRef();
        this.getTotalInvoiceAmountFromSiteAndRecipientRef();
        this.onTypeChange();
      });
    } catch (error) {

    }
  }
  public async selectSubLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.SubLedgerList;
      this.openSelectModal(options, this.selectedSubLedger, false, 'Select Sub Ledger', 1, (selected) => {
        this.selectedSubLedger = selected;
        this.Entity.p.SubLedgerRef = selected[0].p.Ref;
        this.SubLedgerName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.LedgerList;
      this.openSelectModal(options, this.selectedLedger, false, 'Select Ledger', 1, (selected) => {
        this.selectedLedger = selected;
        this.Entity.p.LedgerRef = selected[0].p.Ref;
        this.LedgerName = selected[0].p.Name;
        this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef)
      });
    } catch (error) {

    }
  }

  public async selectSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;
        this.Entity.p.SiteRef = selected[0].p.Ref;
        this.SiteName = selected[0].p.Name;
        this.getTotalInvoiceAmountFromSiteAndRecipientRef()
        this.Entity.p.RecipientType = 0;
        this.Entity.p.RecipientRef = 0;
        this.RecipientList = []

      });
    } catch (error) {

    }
  }

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }
  isDataFilled(): boolean {
    const emptyEntity: Expense = Expense.CreateNewInstance();
    console.log('emptyEntity :', emptyEntity);
    console.log('this Entity :', this.Entity);
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.Date']);
  }

  deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
    const clean = (obj: any, path = ''): any => {
      if (obj === null || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        if (ignorePaths.includes(fullPath)) continue;
        result[key] = clean(obj[key], fullPath);
      }
      return result;
    };

    const cleanedObj1 = clean(obj1);
    const cleanedObj2 = clean(obj2);

    return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
  }

  goBack = async () => {
    // Replace this with your actual condition to check if data is filled
    const isDataFilled = this.isDataFilled(); // Implement this function based on your form

    if (isDataFilled) {
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('User cancelled.');
            }
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: () => {
              this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses'], { replaceUrl: true });
              this.haptic.success();
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses'], { replaceUrl: true });
      this.haptic.success();
    }
  }
}
