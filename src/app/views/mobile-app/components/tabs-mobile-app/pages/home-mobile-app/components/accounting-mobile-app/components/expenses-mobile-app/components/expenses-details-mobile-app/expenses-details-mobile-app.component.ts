import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, ModeOfPayments } from 'src/app/classes/domain/domainenums/domainenums';
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
  UnitList: Unit[] = [];
  RecipientNameInput: boolean = false
  isSaveDisabled: boolean = false;
  ShreeBalance: number = 0;
  DetailsFormTitle: 'New Expense' | 'Edit Expense' = 'New Expense';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Expense = null as any;
  LedgerList: Ledger[] = [];
  companyRef: number = 0;
  BankList: BankAccount[] = [];
  Cheque = ModeOfPayments.Cheque
  Cash = ModeOfPayments.Cash
  Bill = ModeOfPayments.Bill
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref !== this.Bill);
  Date: string = '';
  UnitName: string = '';
  selectedUnit: any[] = [];

  TotalOrderedQty: number = 0;

  showExpenseDatePicker = false;
  ExpenseDate = '';
  DisplayExpenseDate = '';


  LedgerName: string = '';
  selectedLedger: any[] = [];

  SubLedgerName: string = '';
  selectedSubLedger: any[] = [];

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
          this.Date = this.Entity.p.Date;
          this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
          this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          this.appStateManage.StorageKey.removeItem('Editable');
          this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
        } else {
          this.Entity = Expense.CreateNewInstance();
          Expense.SetCurrentInstance(this.Entity);
          let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          this.Date = strCDT.substring(0, 10);
        }
        this.getRecipientListByCompanyRef()
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
    this.ExpenseDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.ExpenseDate;
    this.DisplayExpenseDate = this.ExpenseDate;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }


  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.UnitList = lst;
  }

  public FormulateBankList = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await BankAccount.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.BankList = lst
  };

  OnModeChange = () => {
    this.Entity.p.BankAccountRef = 0
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.Entity.p.SubLedgerRef = 0
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.LedgerList = lst
  };

  getTotalExpenseFromSiteAndRecipientName = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      // await this.uiUtils.showErrorToster('Selected Site to get Shree Expense');
      await this.toastService.present('Selected Site to get Shree Expense', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    if (this.Entity.p.RecipientRef <= 0) {
      // await this.uiUtils.showErrorToster('Selected Recipient Name to get Shree Expense');
      await this.toastService.present('Selected Recipient Name to get Shree Expense', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    let data = await Expense.FetchTotalInvoiceAmountFromSiteAndRecipient(this.companyRef, this.Entity.p.SiteRef, this.Entity.p.RecipientType, this.Entity.p.RecipientRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );

    this.Entity.p.InvoiceAmount = data[0].p.InvoiceAmount;
    if (this.Entity.p.RecipientRef) {
      const RecipientData = data.find(item => item.p.Ref == this.Entity.p.RecipientRef)
      this.Entity.p.IsSiteRef = RecipientData?.p.IsSiteRef || 0
    }
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      // await this.uiUtils.showErrorToster('Ledger not Selected');
      await this.toastService.present('Ledger not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SubLedgerList = lst;
  }

  getRecipientListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(this.companyRef, this.Entity.p.RecipientType, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
    this.RecipientList = lst;
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
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
      await this.toastService.present('Error ' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      // await this.uiUtils.showSuccessToster('Recipient Name saved successfully');
      await this.toastService.present('Recipient Name saved successfully', 1000, 'success');
      await this.haptic.success();
      this.RecipientNameInput = false
      this.RecipientEntity = Recipient.CreateNewInstance();
      await this.getRecipientListByCompanyRef()
    }
  };

  SaveExpense = async () => {
    this.Entity.p.CompanyRef = this.companyRef;
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Date);
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      // this.uiUtils.showErrorMessage('Error', tr.Message);
      await this.toastService.present('Error ' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        // await this.uiUtils.showSuccessToster('Expense saved successfully');
        await this.toastService.present('Expense saved successfully', 1000, 'success');
        await this.haptic.success();
        this.Entity = Expense.CreateNewInstance();
        await this.getCurrentBalanceByCompanyRef()
      } else {
        // await this.uiUtils.showSuccessToster('Expense Updated successfully');
        await this.toastService.present('Expense Updated successfully', 1000, 'success');
        await this.haptic.success();
        await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expense']);
      }
    }
  };

  public async selectBankBottomsheet(): Promise<void> {
    try {
      // const options = this.BankList;
      const options = this.BankList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedBank, false, 'Select Mode of Payment', 1, (selected) => {
        this.selectedBank = selected;
        // this.Entity.p.Bank = selected[0].p.Ref;
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
        // this.Entity.p.ModeOfPayment = selected[0].p.Ref;
        this.ModeOfPaymentName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }

  public async selectRecipientNameBottomsheet(): Promise<void> {
    try {
      const options = this.RecipientList;
      this.openSelectModal(options, this.selectedRecipientName, false, 'Select Recipient Name', 1, (selected) => {
        this.selectedRecipientName = selected;
        // this.Entity.p.RecipientMasterRef = selected[0].p.Ref;
        this.RecipientName = selected[0].p.Name;
        this.getTotalExpenseFromSiteAndRecipientName();
        this.onRecipientChange();
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
        this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
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
        this.getTotalExpenseFromSiteAndRecipientName()
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
    const emptyEntity: Invoice = Invoice.CreateNewInstance();
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
              this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expense'], { replaceUrl: true });
              this.haptic.success();
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expense'], { replaceUrl: true });
      this.haptic.success();
    }
  }
}
