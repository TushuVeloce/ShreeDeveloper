import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, ModeOfPayments, PayerTypes } from 'src/app/classes/domain/domainenums/domainenums';
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
  BankList: OpeningBalance[] = [];
  Cash = ModeOfPayments.Cash
  Bill = ModeOfPayments.Bill
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(item => item.Ref !== this.Bill);
  PayerTypesList = DomainEnums.PayerTypesList();
  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  payerTypeRecipient = PayerTypes.Payers

  Date: string = '';

  IncomeDate: string | null = null;

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
  RemainingPlotAmount: number = 0;

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
    // await this.loadIncomeDetailsIfCompanyExists();
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
          this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          if (this.Entity.p.Date != '') {
            this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
            this.IncomeDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
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

          this.BankName = this.BankList.find(item => item.p.Ref == this.Entity.p.BankAccountRef)?.p.BankName ?? '';
          this.selectedBank = [{ p: { Ref: this.Entity.p.BankAccountRef, Name: this.BankName } }];

        } else {
          this.Entity = Income.CreateNewInstance();
          Income.SetCurrentInstance(this.Entity);
          let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = strCDT.substring(0, 16).split('-');
          strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
          this.Entity.p.Date = strCDT;
          this.IncomeDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
        }

        this.getPayerListBySiteAndPayerType()
        this.getCurrentBalanceByCompanyRef();
        this.InitialEntity = Object.assign(
          Income.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as Income;
      } else {
        await this.toastService.present('company not selected', 1000, 'warning');
        await this.haptic.warning();
      }
    } catch (error) {
      await this.toastService.present('Failed to load Income details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }

  public async onIncomeDateChange(date: any): Promise<void> {
    this.IncomeDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? null;
    this.Entity.p.Date = this.IncomeDate ?? '';
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
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.BankList = lst.filter((item) => item.p.BankAccountRef > 0 && item.p.OpeningBalanceAmount > 0)

  };

  OnModeChange = () => {
    this.Entity.p.BankAccountRef = 0
    this.selectedBank=[];
    this.BankName='';
  }

  CalculateShreeBalance = () => {
    this.Entity.p.ShreesBalance = this.ShreeBalance + this.Entity.p.IncomeAmount;
    this.RemainingPlotAmount = this.Entity.p.RemainingPlotAmount - this.Entity.p.IncomeAmount;
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
    this.ShreeBalance = lst[0].p.ShreesBalance;
  }

  onPayerChange = async () => {
    let SingleRecord;
    try {
      if (this.Entity.p.PayerType == this.DealDoneCustomer) {
        SingleRecord = this.PayerList.find((data) => data.p.PlotName == this.PayerPlotNo);
      } else {
        SingleRecord = this.PayerList.find((data) => data.p.Ref == this.Entity.p.PayerRef);
      }

      if (SingleRecord?.p) {
        this.Entity.p.IsRegisterCustomerRef = SingleRecord.p.IsRegisterCustomerRef;
        this.Entity.p.PayerRef = SingleRecord.p.Ref;
        if (this.Entity.p.PayerType == this.DealDoneCustomer) {
          this.Entity.p.PlotRef = SingleRecord.p.PlotRef;
          this.Entity.p.PlotName = SingleRecord.p.PlotName;
          let lst = await Income.FetchToalAmountByCompanyAndPlotRef(this.companyRef, this.Entity.p.PlotRef, async errMsg => {
            await this.toastService.present('Error ' + errMsg, 1000, 'danger');
            await this.haptic.error();
          });
          if (lst.length > 0) {
            this.Entity.p.TotalPlotAmount = lst[0].p.TotalPlotAmount;
            this.Entity.p.RemainingPlotAmount = lst[0].p.RemainingPlotAmount;
            this.RemainingPlotAmount = lst[0].p.RemainingPlotAmount;
            this.Entity.p.PlotGrandTotal = lst[0].p.PlotGrandTotal;
          }
        } else {
          this.Entity.p.TotalPlotAmount = 0;
          this.Entity.p.RemainingPlotAmount = 0;
          this.RemainingPlotAmount = 0;
          this.Entity.p.PlotGrandTotal = 0;
          this.Entity.p.PlotRef = 0;
          this.Entity.p.PlotName = '';
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
      await this.toastService.present('Payer Name can not be Blank', 1000, 'warning');
      await this.haptic.warning();
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
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      if (this.IsNewEntity) {
        await this.toastService.present('Payer Name saved successfully', 1000, 'success');
        await this.haptic.success();
        this.PayerNameInput = false
        await this.getPayerListBySiteAndPayerType()
        this.PayerEntity = Payer.CreateNewInstance();
      }
    }
  };


  onTypeChange = () => {
    this.Entity.p.PayerRef = 0;
    this.Entity.p.PayerName = '';
    this.selectedPayer = [];
    this.PayerName = '';
    this.PayerPlotNo = '';
    this.PayerNameInput = false;
    this.Entity.p.TotalPlotAmount = 0;
    this.Entity.p.RemainingPlotAmount = 0;
    this.RemainingPlotAmount = 0;
    this.Entity.p.PlotGrandTotal = 0;
  }

  getPayerListBySiteAndPayerType = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (this.Entity.p.PayerType <= 0) {
      return;
    }
    let lst = await Income.FetchPayerNameByPayerTypeRef(this.Entity.p.SiteRef, this.companyRef, this.Entity.p.PayerType, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.PayerList = lst;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SubLedgerRef = 0
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerRef: number) => {
    if (ledgerRef <= 0) {
      await this.toastService.present('Ledger not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
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
      this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.IncomeDate ?? '');
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);

      if (!tr.Successful) {
        this.isSaveDisabled = false;
        await this.toastService.present(tr.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      } else {
        this.isSaveDisabled = false;
        if (this.IsNewEntity) {
          await this.toastService.present('Income saved successfully', 1000, 'success');
          await this.haptic.success();
          this.Entity = Income.CreateNewInstance();
          this.getCurrentBalanceByCompanyRef();
          await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income'], { replaceUrl: true });
        } else {
          await this.toastService.present('Income Update successfully', 1000, 'success');
          await this.haptic.success();
          await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income'], { replaceUrl: true });
        }
      }
    } catch (error) {

    } finally {
      await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income'], { replaceUrl: true });
      await this.loadingService.hide()
    }
  };

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  public async selectBankBottomsheet(): Promise<void> {
    try {
      const options = this.BankList.map((item) => ({ Ref: item.p.BankAccountRef, Name: item.p.BankName }));
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
      let options: any[] = this.PayerList.map(item => {
        let name = this.Entity.p.PayerType === this.DealDoneCustomer
          ? `${item.p.PayerName} - ${item.p.PlotName}`
          : item.p.PayerName;

        return {
          p: {
            Ref: item.p.Ref,
            PlotName: item.p.PlotName || '',
            Name: name,
            PayerName: item.p.PayerName,
          }
        };
      });

      this.openSelectModal(options, this.selectedPayer, false, 'Select Payer Name', 1, (selected) => {
        if (!selected || selected.length === 0) return;
        this.selectedPayer = selected;
        this.Entity.p.PayerRef = selected[0].p.Ref;
        this.PayerName = selected[0].p.Name;

        if (this.Entity.p.PayerType === this.DealDoneCustomer) {
          this.PayerPlotNo = selected[0].p.PlotName;
          this.Entity.p.PlotName = selected[0].p.PlotName;
        }

        this.onPayerChange();
      });

    } catch (error) {
    }
  }

  public async selectFromWhomTypeBottomsheet(): Promise<void> {
    try {
      const options = this.PayerTypesList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedPayerType, false, 'Select From Whom Type', 1, (selected) => {
        this.selectedPayerType = selected;
        this.Entity.p.PayerType = selected[0].p.Ref;
        this.PayerTypeName = selected[0].p.Name;
        this.getPayerListBySiteAndPayerType();
        this.onTypeChange();
        this.selectedPayer = [];
        this.PayerName = '';

      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
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
        this.onSiteChange()
        this.getPayerListBySiteAndPayerType()
      });
    } catch (error) {
      await this.toastService.present('Error ' + error, 1000, 'danger');
      await this.haptic.error();
    }
  }
  onSiteChange = () => {
    this.Entity.p.TotalPlotAmount = 0;
    this.Entity.p.RemainingPlotAmount = 0;
    this.RemainingPlotAmount = 0;
    this.Entity.p.PlotGrandTotal = 0;
    this.PayerPlotNo = '';
    this.Entity.p.PlotName = '';
    
    this.Entity.p.PayerRef = 0;
    this.selectedPayer = [];
    this.PayerName = '';
    this.Entity.p.LedgerRef = 0;
    this.selectedLedger = [];
    this.LedgerName = '';
    this.Entity.p.SubLedgerRef = 0;
    this.selectedSubLedger = [];
    this.SubLedgerName = '';
    this.Entity.p.PayerType = 0;
    this.selectedPayerType = [];
    this.PayerTypeName = '';
    this.Entity.p.PlotName = '';
    this.PayerPlotNo = '';
    this.PayerList = []
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
