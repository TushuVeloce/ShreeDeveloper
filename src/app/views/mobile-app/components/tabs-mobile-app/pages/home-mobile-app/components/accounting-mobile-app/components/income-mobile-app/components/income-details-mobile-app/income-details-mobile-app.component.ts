import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, ModeOfPayments, PayerTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Payer } from 'src/app/classes/domain/entities/website/masters/payer/payer';
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
  selector: 'app-income-details-mobile-app',
  templateUrl: './income-details-mobile-app.component.html',
  styleUrls: ['./income-details-mobile-app.component.scss'],
  standalone: false
})
export class IncomeDetailsMobileAppComponent implements OnInit {
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
  companyRef: number = 0;
  BankList: BankAccount[] = [];
  Cash = ModeOfPayments.Cash
  Bill = ModeOfPayments.Bill
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref !== this.Bill);
  PayerTypesList = DomainEnums.PayerTypesList();
  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  payerTypeRecipient = PayerTypes.Payers

  Date: string = '';

  showIncomeDatePicker = false;
  IncomeDate = '';
  DisplayIncomeDate = '';

  LedgerName: string = '';
  selectedLedger: any[] = [];

  SubLedgerName: string = '';
  selectedSubLedger: any[] = [];

  selectedPayerType: any[] = [];
  PayerTypeName: string = '';

  selectedPayer: any[] = [];
  PayerName: string = '';

  RecipientName: string = '';
  selectedRecipientName: any[] = [];

  selectedSite: any[] = [];
  SiteName: string = '';

  ModeOfPaymentName: string = '';
  selectedModeOfPayment: any[] = [];

  BankName: string = '';
  selectedBank: any[] = [];
  PayerPlotNo: string = '';



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
    await this.loadIncomeDetailsIfCompanyExists();

  }
  ionViewWillEnter = async () => {
    await this.loadIncomeDetailsIfCompanyExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  private async loadIncomeDetailsIfCompanyExists() {
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
          this.DetailsFormTitle = this.IsNewEntity ? 'New Income' : 'Edit Income';
          this.Entity = Income.GetCurrentInstance();
          console.log('this.Entity :', this.Entity);
          this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          if (this.Entity.p.Date != '') {
            this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
            this.IncomeDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
            this.DisplayIncomeDate = this.datePipe.transform(this.IncomeDate, 'yyyy-MM-dd') ?? '';;
          }
          this.appStateManage.StorageKey.removeItem('Editable');
          await this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
          this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));

          this.selectedSite = [{ p: { Ref: this.Entity.p.SiteRef, Name: this.Entity.p.SiteName } }];
          this.SiteName = this.Entity.p.SiteName;

          this.selectedLedger = [{ p: { Ref: this.Entity.p.LedgerRef, Name: this.Entity.p.LedgerName } }];
          this.LedgerName = this.Entity.p.LedgerName;

          this.selectedSubLedger = [{ p: { Ref: this.Entity.p.SubLedgerRef, Name: this.Entity.p.SubLedgerName } }];
          this.SubLedgerName = this.Entity.p.SubLedgerName;

          this.PayerTypeName = this.PayerTypesList.find(item => item.Ref == this.Entity.p.PayerType)?.Name ?? '';
          this.selectedPayerType = [{ p: { Ref: this.Entity.p.PayerType, Name: this.PayerTypeName } }];

          this.selectedPayer = [{ p: { Ref: this.Entity.p.PayerRef, Name: this.Entity.p.PayerName } }];
          this.PayerName = this.Entity.p.PayerName;

          this.ModeOfPaymentName = this.ModeofPaymentList.find(item => item.Ref == this.Entity.p.IncomeModeOfPayment)?.Name ?? '';
          this.selectedModeOfPayment = [{ p: { Ref: this.Entity.p.IncomeModeOfPayment, Name: this.ModeOfPaymentName } }];

          this.BankName = this.BankList.find(item => item.p.Ref == this.Entity.p.BankAccountRef)?.p.Name ?? '';
          this.selectedBank = [{ p: { Ref: this.Entity.p.BankAccountRef, Name: this.BankName } }];

        } else {
          this.Entity = Income.CreateNewInstance();
          Income.SetCurrentInstance(this.Entity);
          // let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          // this.Date = strCDT.substring(0, 10);
          let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = strCDT.substring(0, 16).split('-');
          strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
          this.Entity.p.Date = strCDT;
          this.IncomeDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          this.DisplayIncomeDate = this.datePipe.transform(this.IncomeDate, 'yyyy-MM-dd') ?? '';;
        }

        this.getPayerListByPayerType()
        this.getCurrentBalanceByCompanyRef();
        this.InitialEntity = Object.assign(
          Income.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as Income;
      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading Income details:', error);
      await this.toastService.present('Failed to load Income details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }

  public async onIncomeDateChange(date: any): Promise<void> {
    console.log('this.IncomeDate :', this.IncomeDate);
    this.IncomeDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.IncomeDate;
    console.log('this.Entity.p.Date :', this.Entity.p.Date);
    this.DisplayIncomeDate = this.IncomeDate;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }


  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
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
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.BankList = lst
  };

  OnModeChange = () => {
    this.Entity.p.BankAccountRef = 0
  }

  CalculateShreeBalance = () => {
    this.Entity.p.ShreesBalance = this.ShreeBalance + this.Entity.p.IncomeAmount;
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
    this.ShreeBalance = lst[0].p.ShreesBalance;
  }

  getPayerListByPayerType = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    if (this.Entity.p.PayerType <= 0) {
      // await this.uiUtils.showErrorToster('Payer Type not Selected');
      return;
    }
    let lst = await Income.FetchPayerNameByPayerTypeRef(this.Entity.p.SiteRef, this.companyRef, this.Entity.p.PayerType, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
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
  // onPayerChange = () => {
  //   console.log('this.PayerPlotNo :', this.PayerPlotNo);
  //   try {
  //     let SingleRecord = this.PayerList.find((data) => data.p.PlotName == this.PayerPlotNo);
  //     console.log('SingleRecord :', SingleRecord);
  //     if (SingleRecord?.p) {
  //       this.Entity.p.IsRegisterCustomerRef = SingleRecord.p.IsRegisterCustomerRef;
  //       this.Entity.p.PayerRef = SingleRecord.p.Ref;
  //       if (this.Entity.p.PayerType == this.DealDoneCustomer) {
  //         this.Entity.p.PlotName = SingleRecord.p.PlotName;
  //       }
  //     }
  //   } catch (error) {
  //   }
  //   console.log('this.Entity.p.PayerRef :', this.Entity.p.PayerRef);
  // }

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
      //  this.uiUtils.showErrorToster('Payer Name can not be Blank');
      await this.toastService.present('Payer Name can not be Blank', 1000, 'danger');
      await this.haptic.error();
      return
    }
    this.PayerEntity.p.CompanyRef = this.companyRef;
    this.PayerEntity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.PayerEntity.p.CreatedBy == 0) {
      this.PayerEntity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
      this.PayerEntity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.PayerEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      await this.toastService.present('Error ' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      if (this.IsNewEntity) {
        await this.toastService.present('Payer Name saved successfully', 1000, 'success');
        await this.haptic.success();
        this.PayerNameInput = false
        await this.getPayerListByPayerType()
        this.PayerEntity = Payer.CreateNewInstance();
      }
    }
  };


  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
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
        await this.toastService.present('Error ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      //  await this.uiUtils.showErrorToster('Ledger not Selected');
      await this.toastService.present('Ledger not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SubLedgerList = lst;
  }

  SaveIncome = async () => {
    try {
      await this.loadingService.show();
      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
      if (this.Entity.p.CreatedBy == 0) {
        this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
        this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
      }
      this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.IncomeDate);
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
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
          // await this.uiUtils.showSuccessToster('Income saved successfully');
          await this.toastService.present('Income saved successfully', 1000, 'success');
          await this.haptic.success();
          this.Entity = Income.CreateNewInstance();
          this.getCurrentBalanceByCompanyRef();
          await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income']);
        } else {
          // await this.uiUtils.showSuccessToster('Income saved successfully');
          await this.toastService.present('Income Update successfully', 1000, 'success');
          await this.haptic.success();
          await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income']);
        }
      }
    } catch (error) {

    } finally {
      await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income']);
      await this.loadingService.hide()
    }
  };

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  public async selectBankBottomsheet(): Promise<void> {
    try {
      const options = this.BankList;
      this.openSelectModal(options, this.selectedBank, false, 'Select Bank', 1, (selected) => {
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
        this.Entity.p.IncomeModeOfPayment = selected[0].p.Ref;
        this.ModeOfPaymentName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }


  public async selectPayerNameBottomsheet(): Promise<void> {
    try {
      // const options = this.PayerList;
      console.log('this.PayerList :', this.PayerList);
      let options: any[] = [];
      if (options) {
        options = this.PayerList.map(item => ({
          p: {
            Ref: item.p.Ref,
            PlotName: item.p.PlotName||'',
            Name: item.p.PayerType == this.DealDoneCustomer ? item.p.PayerName : item.p.PayerName + " " + item.p.PlotName
          }
        }));

      }
      this.openSelectModal(options, this.selectedPayer, false, 'Select Payer Name', 1, (selected) => {
        this.selectedPayer = selected;
        this.Entity.p.PayerRef = selected[0].p.Ref;
        this.PayerName = selected[0].p.Name;
        console.log('selected[0].p.PayerType == this.DealDoneCustomer :', selected[0].p.Ref, selected[0].p.PlotName, this.DealDoneCustomer);
        if (selected[0].p.Ref != this.DealDoneCustomer) {
        this.PayerPlotNo = selected[0].p.PlotName;
        this.Entity.p.PlotName = selected[0].p.PlotName;
      }
        this.onPayerChange()
      });
    } catch (error) {

    }
  }

  public async selectFromWhomTypeBottomsheet(): Promise<void> {
    try {
      // const options = this.PayerTypesList;
      const options = this.PayerTypesList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedPayerType, false, 'Select From Whom Type', 1, (selected) => {
        this.selectedPayerType = selected;
        this.Entity.p.PayerType = selected[0].p.Ref;
        this.PayerTypeName = selected[0].p.Name;
        this.getPayerListByPayerType();
        this.selectedPayer = [];
        this.PayerName = '';

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
        this.getPayerListByPayerType();
        this.Entity.p.PayerRef = 0;
        // this.PayerPlotNo = '';
        this.Entity.p.LedgerRef = 0;
        this.Entity.p.SubLedgerRef = 0;
        this.Entity.p.PayerType = 0;
        this.Entity.p.PlotName = '';
        this.PayerList = []
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
    const emptyEntity: Income = Income.CreateNewInstance();
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
              this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income'], { replaceUrl: true });
              this.haptic.success();
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income'], { replaceUrl: true });
      this.haptic.success();
    }
  }
}
