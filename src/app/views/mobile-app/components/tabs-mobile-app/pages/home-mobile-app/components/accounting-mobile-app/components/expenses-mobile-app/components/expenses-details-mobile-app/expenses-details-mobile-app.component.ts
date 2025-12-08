import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DomainEnums,
  ModeOfPayments,
  PayerTypes,
  RecipientTypes,
  TypeOfEmployeePayments,
} from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
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
  standalone: false,
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
  RecipientNameInput: boolean = false;
  isSaveDisabled: boolean = false;
  ShreeBalance: number = 0;
  DetailsFormTitle: 'New Expense' | 'Edit Expense' = 'New Expense';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Expense = null as any;
  LedgerList: Ledger[] = [];
  companyRef = 0;
  BankList: OpeningBalance[] = [];
  IncomeBankList: BankAccount[] = [];
  Cash = ModeOfPayments.Cash;
  Bill = ModeOfPayments.Bill;
  ModeofPaymentList = DomainEnums.ModeOfPaymentsList().filter(
    (item) => item.Ref !== this.Bill
  );
  RecipientTypesList = DomainEnums.RecipientTypesList();
  payerTypeRecipient = RecipientTypes.Recipient;
  Employee = RecipientTypes.Employee;
  Sites = RecipientTypes.Sites;
  Date: string = '';
  PaymentType: number = 0;
  TypeofEmployeePaymentList = DomainEnums.TypeOfEmployeePaymentsList();
  TypeofEmployeePayments = TypeOfEmployeePayments;
  EmployeeType = RecipientTypes.Employee;
  DealDoneCustomer = PayerTypes.DealDoneCustomer;
  OldGivenAmount: number = 0;

  ExpenseDate: string | null = null;

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

  ModeOfPaymentNameForIncome: string = '';
  selectedModeOfPaymentForIncome: any[] = [];

  BankName: string = '';
  selectedBank: any[] = [];

  BankNameForIncome: string = '';
  selectedBankForIncome: any[] = [];

  BankNameForNewBank: string = '';
  selectedBankForNewBank: any[] = [];

  PaymentTypeName: string = '';
  selectedPaymentType: any[] = [];

  PayerPlotNo: string = '';
  IsDiscountEditing: boolean = false;

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
    private datePipe: DatePipe
  ) {}

  ngOnInit = async () => {
    // await this.loadInvoiceDetailsIfCompanyExists();
  };
  ionViewWillEnter = async () => {
    await this.loadInvoiceDetailsIfCompanyExists();
  };
  ngOnDestroy() {
    // Cleanup if needed
  }

  private async loadInvoiceDetailsIfCompanyExists() {
    try {
      await this.loadingService.show(); // Awaiting this is critical
      this.companyRef = Number(
        this.appStateManage.localStorage.getItem('SelectedCompanyRef')
      );

      if (this.companyRef > 0) {
        this.appStateManage.setDropdownDisabled(true);
        await this.getUnitList();
        await this.getSiteListByCompanyRef();
        await this.getLedgerListByCompanyRef();
        await this.FormulateBankList();
        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity
            ? 'New Expense'
            : 'Edit Expense';
          this.Entity = Expense.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable');

          this.selectedSite = [
            { p: { Ref: this.Entity.p.SiteRef, Name: this.Entity.p.SiteName } },
          ];
          this.SiteName = this.Entity.p.SiteName;

          this.selectedLedger = [
            {
              p: {
                Ref: this.Entity.p.LedgerRef,
                Name: this.Entity.p.LedgerName,
              },
            },
          ];
          this.LedgerName = this.Entity.p.LedgerName;

          this.selectedSubLedger = [
            {
              p: {
                Ref: this.Entity.p.SubLedgerRef,
                Name: this.Entity.p.SubLedgerName,
              },
            },
          ];
          this.SubLedgerName = this.Entity.p.SubLedgerName;

          this.ToWhomTypeName =
            this.RecipientTypesList.find(
              (item) => item.Ref == this.Entity.p.RecipientType
            )?.Name ?? '';
          this.selectedToWhomType = [
            {
              p: {
                Ref: this.Entity.p.RecipientType,
                Name: this.ToWhomTypeName,
              },
            },
          ];

          this.selectedRecipientName = [
            {
              p: {
                Ref: this.Entity.p.RecipientRef,
                Name: this.Entity.p.RecipientName,
              },
            },
          ];
          this.RecipientName = this.Entity.p.RecipientName;

          this.ModeOfPaymentName =
            this.ModeofPaymentList.find(
              (item) => item.Ref == this.Entity.p.ExpenseModeOfPayment
            )?.Name ?? '';
          this.selectedModeOfPayment = [
            {
              p: {
                Ref: this.Entity.p.ExpenseModeOfPayment,
                Name: this.ModeOfPaymentName,
              },
            },
          ];

          this.ModeOfPaymentNameForIncome =
            this.ModeofPaymentList.find(
              (item) => item.Ref == this.Entity.p.ModeOfPaymentForIncome
            )?.Name ?? '';
          this.selectedModeOfPaymentForIncome = [
            {
              p: {
                Ref: this.Entity.p.ModeOfPaymentForIncome,
                Name: this.ModeOfPaymentNameForIncome,
              },
            },
          ];

          if (this.Entity.p.IsAdvancePayment && this.Entity.p.IsSalaryExpense) {
            this.PaymentType = this.TypeofEmployeePayments.Advance;
            this.PaymentTypeName =
              this.TypeofEmployeePaymentList.find(
                (item) => item.Ref == this.PaymentType
              )?.Name ?? '';
            this.selectedPaymentType = [
              {
                p: {
                  Ref: this.Entity.p.ModeOfPaymentForIncome,
                  Name: this.PaymentTypeName,
                },
              },
            ];
          } else if (
            !this.Entity.p.IsAdvancePayment &&
            this.Entity.p.IsSalaryExpense
          ) {
            this.PaymentType = this.TypeofEmployeePayments.Salary;
            this.PaymentTypeName =
              this.TypeofEmployeePaymentList.find(
                (item) => item.Ref == this.PaymentType
              )?.Name ?? '';
            this.selectedPaymentType = [
              {
                p: {
                  Ref: this.Entity.p.ModeOfPaymentForIncome,
                  Name: this.PaymentTypeName,
                },
              },
            ];
          } else {
            this.PaymentType = this.TypeofEmployeePayments.Other;
            this.PaymentTypeName =
              this.TypeofEmployeePaymentList.find(
                (item) => item.Ref == this.PaymentType
              )?.Name ?? '';
            this.selectedPaymentType = [
              {
                p: {
                  Ref: this.Entity.p.ModeOfPaymentForIncome,
                  Name: this.PaymentTypeName,
                },
              },
            ];
          }

          if (this.Entity.p.IncomeLedgerRef != 0) {
            await this.getSubIncomeLedgerListByIncomeLedgerRef(
              this.Entity.p.IncomeLedgerRef
            );
          }
          if (this.Entity.p.RecipientType != 0) {
            await this.getRecipientListByRecipientTypeRef();
          }
          if (this.Entity.p.Date != '') {
            this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(
              this.Entity.p.Date
            );
            this.ExpenseDate = this.dtu.ConvertStringDateToShortFormat(
              this.Entity.p.Date
            );
          }
          await this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
          this.Date = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.Date
          );
          this.Entity.p.UpdatedBy = Number(
            this.appStateManage.localStorage.getItem('LoginEmployeeRef')
          );

          this.selectedIncomeLedger = [
            {
              p: {
                Ref: this.Entity.p.IncomeLedgerRef,
                Name: this.Entity.p.IncomeLedgerName,
              },
            },
          ];
          this.IncomeLedgerName = this.Entity.p.IncomeLedgerName;

          this.selectedIncomeSubLedger = [
            {
              p: {
                Ref: this.Entity.p.IncomeSubLedgerRef,
                Name: this.Entity.p.IncomeSubLedgerName,
              },
            },
          ];
          this.IncomeSubLedgerName = this.Entity.p.IncomeSubLedgerName;

          this.PaymentTypeName =
            this.TypeofEmployeePaymentList.find(
              (item) => item.Ref == this.PaymentType
            )?.Name ?? '';
          this.selectedPaymentType = [
            {
              p: {
                Ref: this.Entity.p.RecipientType,
                Name: this.PaymentTypeName,
              },
            },
          ];

          this.BankName =
            this.BankList.find(
              (item) => item.p.BankAccountRef == this.Entity.p.BankAccountRef
            )?.p.BankName ?? '';

          this.selectedBank = [
            { p: { Ref: this.Entity.p.Ref, Name: this.BankName } },
          ];
          if (
            this.Entity.p.ModeOfPaymentForIncome != this.Cash &&
            this.Entity.p.ModeOfPaymentForIncome &&
            this.Entity.p.IsNewBankCreated
          ) {
            this.BankNameForIncome =
              this.IncomeBankList.find(
                (item) => item.p.Ref == this.Entity.p.IncomeBankRef
              )?.p.Name ?? '';
            this.selectedBankForIncome = [
              {
                p: {
                  Ref: this.Entity.p.IncomeBankRef,
                  Name: this.BankNameForIncome,
                },
              },
            ];
          }
          if (
            this.Entity.p.ModeOfPaymentForIncome != this.Cash &&
            this.Entity.p.ModeOfPaymentForIncome &&
            !this.Entity.p.IsNewBankCreated
          ) {
            this.BankNameForNewBank =
              this.BankList.find(
                (item) => item.p.BankAccountRef == this.Entity.p.IncomeBankRef
              )?.p.BankName ?? '';
            this.selectedBankForNewBank = [
              {
                p: {
                  Ref: this.Entity.p.BankAccountRef,
                  Name: this.BankNameForNewBank,
                },
              },
            ];
          }
          this.OldGivenAmount = this.Entity.p.GivenAmount;
        } else {
          this.Entity = Expense.CreateNewInstance();
          Expense.SetCurrentInstance(this.Entity);
          let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = strCDT.substring(0, 16).split('-');
          strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
          this.Entity.p.Date = strCDT;
          this.ExpenseDate = this.dtu.ConvertStringDateToShortFormat(
            this.Entity.p.Date
          );
        }
        this.getCurrentBalanceByCompanyRef();
        this.InitialEntity = Object.assign(
          Expense.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as Expense;
      } else {
        await this.toastService.present(
          'company not selected',
          1000,
          'warning'
        );
        await this.haptic.warning();
      }
    } catch (error) {
      await this.toastService.present(
        'Failed to load Invoice details',
        1000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }

  public async onExpenseDateChange(date: any): Promise<void> {
    this.ExpenseDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.ExpenseDate;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async (errMsg) => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.UnitList = lst;
  };

  // public FormulateBankList = async () => {
  //   if (this.companyRef <= 0) {
  //     await this.toastService.present('company not selected', 1000, 'warning');
  //     await this.haptic.warning();
  //     return;
  //   }
  //   let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
  //     await this.toastService.present(errMsg, 1000, 'danger');
  //     await this.haptic.error();
  //   });
  //   this.BankList = lst
  // };
  public FormulateBankList = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.BankList = lst.filter(
      (item) =>
        item.p.BankAccountRef > 0 &&
        (item.p.OpeningBalanceAmount > 0 || item.p.InitialBalance > 0)
    );
    this.getBankListByCompanyRef();
  };

  getBankListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await BankAccount.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );

    this.IncomeBankList = lst.filter(
      (bank) =>
        !this.BankList.some((item) => item.p.BankAccountRef === bank.p.Ref)
    );
  };

  OnModeChange = () => {
    this.Entity.p.BankAccountRef = 0;
    this.selectedBank = [];
    this.BankName = '';
  };
  OnToModeChange = () => {
    this.Entity.p.IncomeBankRef = 0;
    this.selectedBankForIncome = [];
    this.BankNameForIncome = '';
    this.Entity.p.IsNewBankCreated = false;
  };

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.SiteList = lst;
  };

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.Entity.p.SubLedgerRef = 0;
    let lst = await Ledger.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.LedgerList = lst;
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.toastService.present('Ledger not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(
      ledgerref,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.SubLedgerList = lst;
  };

  getSubIncomeLedgerListByIncomeLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.toastService.present('Ledger not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(
      ledgerref,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.IncomeSubLedgerList = lst;
  };

  getRecipientListByRecipientTypeRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      // await this.toastService.present('To Whom not Selected', 1000, 'warning');
      // await this.haptic.warning();
      return;
    }
    this.RecipientList = [];
    let lst = await Invoice.FetchRecipientByRecipientTypeRef(
      this.companyRef,
      this.Entity.p.SiteRef,
      this.Entity.p.RecipientType,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.RecipientList = lst;
  };

  onTypeChange = async () => {
    this.Entity.p.IncomeLedgerRef = 0;
    this.IncomeLedgerName = '';
    this.selectedIncomeLedger = [];
    this.Entity.p.IncomeSubLedgerRef = 0;
    this.IncomeSubLedgerName = '';
    this.selectedIncomeSubLedger = [];
    this.PaymentType = 0;
    this.PaymentTypeName = '';
    this.selectedPaymentType = [];
    this.Entity.p.RecipientRef = 0;
    this.RecipientName = '';
    this.selectedRecipientName = [];
    this.Entity.p.Reason = '';
    this.Entity.p.IsAdvancePayment = 0;
    this.Entity.p.IsSalaryExpense = false;
    this.Entity.p.TotalAdvance = 0;
    this.Entity.p.RemainingAdvance = 0;
    this.Entity.p.InvoiceAmount = 0;
    this.Entity.p.RemainingAmount = 0;
    this.Entity.p.GivenAmount = 0;
    this.Entity.p.BankAccountRef = 0;
    this.BankName = '';
    this.selectedBank = [];
    this.Entity.p.Narration = '';
    this.Entity.p.ExpenseModeOfPayment = 0;
    this.ModeOfPaymentName = '';
    this.selectedModeOfPayment = [];
    this.Entity.p.IsAutoInvoiceEnabled = 0;
    this.RecipientNameInput = false;
    this.PayerPlotNo = '';
    this.Entity.p.PlotName = '';
    this.Entity.p.ModeOfPaymentForIncome = 0;
    this.Entity.p.IsNewBankCreated = false;
    this.Entity.p.IncomeBankRef = 0;
    this.BankNameForIncome = '';
    this.selectedBankForIncome = [];
  };

  onChangeIncomeLedger = () => {
    this.Entity.p.IncomeSubLedgerRef = 0;
    this.selectedIncomeSubLedger = [];
    this.IncomeSubLedgerName = '';
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
  };

  getTotalInvoiceAmountFromSiteAndRecipientRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (this.Entity.p.SiteRef <= 0) {
      return;
    }
    if (this.Entity.p.RecipientType <= 0) {
      return;
    }
    if (this.Entity.p.RecipientRef <= 0) {
      return;
    }
    if (
      this.PaymentType <= 0 &&
      this.Entity.p.ExpenseModeOfPayment == this.Employee
    ) {
      await this.toastService.present(
        'Payment Type not Selected',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    }
    let lst = await Expense.FetchTotalInvoiceAmountFromSiteAndRecipient(
      this.companyRef,
      this.Entity.p.SiteRef,
      this.Entity.p.RecipientType,
      this.Entity.p.RecipientRef,
      this.Entity.p.IsSalaryExpense,
      async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    // if (lst.length > 0) {
    //   this.Entity.p.InvoiceAmount = lst[0].p.InvoiceAmount;
    //   this.Entity.p.RemainingAdvance = lst[0].p.RemainingAdvance;
    // }
    if (lst.length > 0) {
      if (lst[0].p.InvoiceAmount < 0) {
        this.Entity.p.InvoiceAmount = 0;
      } else {
        if (this.PaymentType != this.TypeofEmployeePayments.Advance) {
          this.Entity.p.InvoiceAmount = lst[0].p.InvoiceAmount;
        }
      }
      this.Entity.p.RemainingAdvance = lst[0].p.RemainingAdvance;
    }
  };

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present('Error' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    if (lst.length > 0) {
      this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
      this.ShreeBalance = lst[0].p.ShreesBalance;
    }
  };

  // onRecipientChange = () => {
  //   try {
  //     let SingleRecord = this.RecipientList.find((data) => data.p.Ref == this.Entity.p.RecipientRef);;
  //     if (SingleRecord?.p) {
  //       this.Entity.p.IsSiteRef = SingleRecord.p.IsSiteRef;
  //     }
  //   } catch (error) {

  //   }
  // }

  onRecipientChange = () => {
    this.Entity.p.TotalAdvance = 0;
    this.Entity.p.RemainingAdvance = 0;
    this.Entity.p.InvoiceAmount = 0;
    this.Entity.p.RemainingAmount = 0;
    this.Entity.p.IncomeLedgerRef = 0;
    this.selectedIncomeLedger = [];
    this.IncomeLedgerName = '';
    this.Entity.p.IncomeSubLedgerRef = 0;
    this.selectedIncomeSubLedger = [];
    this.IncomeSubLedgerName = '';
    this.Entity.p.GivenAmount = 0;
    this.Entity.p.IncomeBankRef = 0;
    this.BankNameForIncome = '';
    this.selectedBankForIncome = [];
    this.Entity.p.ModeOfPaymentForIncome = 0;
    this.selectedModeOfPaymentForIncome = [];
    this.ModeOfPaymentNameForIncome = '';
    this.Entity.p.IsNewBankCreated = false;
    this.Entity.p.Narration = '';
    this.Entity.p.IsAutoInvoiceEnabled = 0;
    this.RecipientNameInput = false;
    this.getCurrentBalanceByCompanyRef();

    let SingleRecord;
    try {
      if (this.Entity.p.RecipientType == this.DealDoneCustomer) {
        SingleRecord = this.RecipientList.find(
          (data, i) => data.p.PlotName == this.PayerPlotNo
        );
      } else {
        SingleRecord = this.RecipientList.find(
          (data) => data.p.Ref == this.Entity.p.RecipientRef
        );
      }
      if (SingleRecord?.p) {
        this.Entity.p.IsRegisterCustomerRef =
          SingleRecord.p.IsRegisterCustomerRef;
        this.Entity.p.RecipientRef = SingleRecord.p.Ref;
        if (this.Entity.p.RecipientType == this.DealDoneCustomer) {
          this.Entity.p.PlotRef = SingleRecord.p.PlotRef;
          this.Entity.p.PlotName = SingleRecord.p.PlotName;
        }
      }
      this.getTotalInvoiceAmountFromSiteAndRecipientRef();
    } catch (error) {}
  };

  onSitechange = () => {
    this.selectedToWhomType = [];
    this.ToWhomTypeName = '';
    this.Entity.p.LedgerRef = 0;
    this.selectedLedger = [];
    this.LedgerName = '';
    this.Entity.p.SubLedgerRef = 0;
    this.SubLedgerName = '';
    this.selectedSubLedger = [];
    this.Entity.p.RecipientType = 0;
    this.RecipientList = [];
    this.selectedToWhomType = [];
    this.ToWhomTypeName = '';

    this.Entity.p.IncomeLedgerRef = 0;
    this.selectedIncomeLedger = [];
    this.IncomeLedgerName = '';
    this.Entity.p.IncomeSubLedgerRef = 0;
    this.selectedIncomeSubLedger = [];
    this.IncomeSubLedgerName = '';
    this.PaymentType = 0;
    this.Entity.p.RecipientRef = 0;
    this.Entity.p.Reason = '';
    this.PayerPlotNo = '';
    this.Entity.p.PlotName = '';
    this.Entity.p.IsAdvancePayment = 0;
    this.Entity.p.IsSalaryExpense = false;
    this.Entity.p.TotalAdvance = 0;
    this.Entity.p.RemainingAdvance = 0;
    this.Entity.p.InvoiceAmount = 0;
    this.Entity.p.RemainingAmount = 0;
    this.Entity.p.GivenAmount = 0;
    this.Entity.p.BankAccountRef = 0;
    this.BankName = '';
    this.selectedBank = [];
    this.Entity.p.Narration = '';
    this.Entity.p.ExpenseModeOfPayment = 0;
    this.selectedModeOfPayment = [];
    this.ModeOfPaymentName = '';
    this.Entity.p.ModeOfPaymentForIncome = 0;
    this.selectedModeOfPaymentForIncome = [];
    this.ModeOfPaymentNameForIncome = '';
    this.Entity.p.IsNewBankCreated = false;
    this.Entity.p.IncomeBankRef = 0;
    this.selectedBankForIncome = [];
    this.BankNameForIncome = '';
    this.Entity.p.IsAutoInvoiceEnabled = 0;
    this.RecipientNameInput = false;
    this.getCurrentBalanceByCompanyRef();
  };

  // CalculateRemainingAmountandBalance = () => {
  //   if (this.Entity.p.GivenAmount <= this.Entity.p.InvoiceAmount) {
  //     this.Entity.p.RemainingAmount = Number((this.Entity.p.InvoiceAmount - this.Entity.p.GivenAmount).toFixed(2));
  //   } else {
  //     this.Entity.p.RemainingAmount = 0;
  //   }

  //   if (this.PaymentType == this.TypeofEmployeePayments.Advance) {
  //     this.Entity.p.InvoiceAmount = this.Entity.p.GivenAmount;
  //   }

  //   if (this.Entity.p.GivenAmount <= this.Entity.p.ShreesBalance) {
  //     this.Entity.p.ShreesBalance = Number((this.ShreeBalance - this.Entity.p.GivenAmount).toFixed(2));
  //   } else {
  //     this.Entity.p.ShreesBalance = -Number((this.Entity.p.GivenAmount - this.ShreeBalance).toFixed(2));
  //   }
  //   if (this.Entity.p.IsAdvancePayment) {
  //     this.Entity.p.TotalAdvance = this.Entity.p.RemainingAdvance + this.Entity.p.GivenAmount
  //   }
  // }
  //   CalculateRemainingAmountandBalance = () => {
  //   this.Entity.p.RemainingAmount = Number((this.Entity.p.InvoiceAmount - this.Entity.p.GivenAmount).toFixed(2));
  //   // if (this.Entity.p.GivenAmount <= this.Entity.p.InvoiceAmount) {
  //   // } else {
  //   //   this.Entity.p.RemainingAmount = 0;
  //   // }

  //   if (this.PaymentType == this.TypeofEmployeePayments.Advance) {
  //     this.Entity.p.InvoiceAmount = this.Entity.p.GivenAmount;
  //   }

  //   if (this.IsNewEntity) {
  //     if (this.Entity.p.GivenAmount <= this.Entity.p.ShreesBalance) {
  //       this.Entity.p.ShreesBalance = Number((this.ShreeBalance - this.Entity.p.GivenAmount).toFixed(2));
  //     } else {
  //       this.Entity.p.ShreesBalance = -Number((this.Entity.p.GivenAmount - this.ShreeBalance).toFixed(2));
  //     }
  //   } else {

  //     let currentExpenseAmount = 0;

  //     if (this.Entity.p.GivenAmount > this.OldGivenAmount) {
  //       currentExpenseAmount = this.Entity.p.GivenAmount - this.OldGivenAmount;
  //       this.Entity.p.ShreesBalance = Number((this.ShreeBalance - currentExpenseAmount).toFixed(2));
  //     } else {
  //       currentExpenseAmount = this.OldGivenAmount - this.Entity.p.GivenAmount;
  //       this.Entity.p.ShreesBalance = Number((this.ShreeBalance + currentExpenseAmount).toFixed(2));
  //     }
  //   }

  //   if (this.Entity.p.IsAdvancePayment) {
  //     this.Entity.p.TotalAdvance = this.Entity.p.RemainingAdvance + this.Entity.p.GivenAmount
  //   }
  // }

  //   CalculateRemainingAmountandBalance = () => {
  //   this.Entity.p.RemainingAmount = Number((this.Entity.p.InvoiceAmount - this.Entity.p.DiscountAmount - this.Entity.p.GivenAmount).toFixed(2));
  //   // if (this.Entity.p.GivenAmount <= this.Entity.p.InvoiceAmount) {
  //   // } else {
  //   //   this.Entity.p.RemainingAmount = 0;
  //   // }

  //   if (this.PaymentType == this.TypeofEmployeePayments.Advance) {
  //     this.Entity.p.InvoiceAmount = this.Entity.p.GivenAmount;
  //   }

  //   if (this.IsNewEntity) {
  //     if (this.Entity.p.GivenAmount <= this.Entity.p.ShreesBalance) {
  //       this.Entity.p.ShreesBalance = Number((this.ShreeBalance - this.Entity.p.GivenAmount).toFixed(2));
  //     } else {
  //       this.Entity.p.ShreesBalance = -Number((this.Entity.p.GivenAmount - this.ShreeBalance).toFixed(2));
  //     }
  //   } else {

  //     let currentExpenseAmount = 0;

  //     if (this.Entity.p.GivenAmount > this.OldGivenAmount) {
  //       currentExpenseAmount = this.Entity.p.GivenAmount - this.OldGivenAmount;
  //       this.Entity.p.ShreesBalance = Number((this.ShreeBalance - currentExpenseAmount).toFixed(2));
  //     } else {
  //       currentExpenseAmount = this.OldGivenAmount - this.Entity.p.GivenAmount;
  //       this.Entity.p.ShreesBalance = Number((this.ShreeBalance + currentExpenseAmount).toFixed(2));
  //     }
  //   }

  //   if (this.Entity.p.IsAdvancePayment) {
  //     this.Entity.p.TotalAdvance = this.Entity.p.RemainingAdvance + this.Entity.p.GivenAmount
  //   }
  // }

  CalculateRemainingAmountandBalance = () => {
    const invoice = Number(this.Entity.p.InvoiceAmount) || 0;
    const discount = Number(this.Entity.p.DiscountAmount) || 0;
    let given = Number(this.Entity.p.GivenAmount) || 0;

    // --- 1️⃣ Auto Set Given Amount When Discount Changes ---
    if (this.IsDiscountEditing) {
      given = invoice - discount;
      this.Entity.p.GivenAmount = Number(given.toFixed(2));
    }

    // --- 2️⃣ Remaining Amount ---
    this.Entity.p.RemainingAmount = Number(
      (invoice - discount - given).toFixed(2)
    );

    // --- 3️⃣ Shree Balance Update ---
    if (this.IsNewEntity) {
      if (given <= this.ShreeBalance) {
        this.Entity.p.ShreesBalance = Number(
          (this.ShreeBalance - given).toFixed(2)
        );
      } else {
        this.Entity.p.ShreesBalance = -Number(
          (given - this.ShreeBalance).toFixed(2)
        );
      }
    } else {
      let currentExpenseAmount = 0;

      if (given > this.OldGivenAmount) {
        currentExpenseAmount = given - this.OldGivenAmount;
        this.Entity.p.ShreesBalance = Number(
          (this.ShreeBalance - currentExpenseAmount).toFixed(2)
        );
      } else {
        currentExpenseAmount = this.OldGivenAmount - given;
        this.Entity.p.ShreesBalance = Number(
          (this.ShreeBalance + currentExpenseAmount).toFixed(2)
        );
      }
    }
    console.log('this.Entity :', this.Entity);
  };

  AddRecipientName = () => {
    this.Entity.p.RecipientRef = 0;
    this.RecipientEntity.p.Name = '';
    this.RecipientNameInput = true;
  };

  cancelRecipientName = () => {
    this.RecipientNameInput = false;
    this.RecipientEntity.p.Name = '';
  };

  SaveRecipientName = () => {
    this.RecipientNameInput = false;
    this.Entity.p.RecipientName = '';
  };

  SaveNewRecipientName = async () => {
    if (this.RecipientEntity.p.Name == '') {
      await this.toastService.present(
        'Recipient Name can not be Blank',
        1000,
        'warning'
      );
      await this.haptic.warning();
      return;
    }
    this.RecipientEntity.p.CompanyRef = this.companyRef;
    this.RecipientEntity.p.CompanyName =
      this.companystatemanagement.getCurrentCompanyName();
    if (this.RecipientEntity.p.CreatedBy == 0) {
      this.RecipientEntity.p.CreatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
      this.RecipientEntity.p.UpdatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );
    }
    let entityToSave = this.RecipientEntity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      await this.toastService.present(tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      this.RecipientNameInput = false;
      this.RecipientEntity = Recipient.CreateNewInstance();
      await this.getRecipientListByRecipientTypeRef();
      await this.toastService.present(
        'Recipient Name saved successfully',
        1000,
        'success'
      );
      await this.haptic.success();
    }
  };

  SaveExpense = async () => {
    try {
      await this.loadingService.show();
      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName =
        this.companystatemanagement.getCurrentCompanyName();

      if (this.Entity.p.RecipientType == this.Sites) {
        if (this.Entity.p.SiteRef == this.Entity.p.RecipientRef) {
          if (
            this.Entity.p.ExpenseModeOfPayment == this.Cash &&
            this.Entity.p.ModeOfPaymentForIncome == this.Cash
          ) {
            // await this.uiUtils.showWarningToster("Cash trasanction in Same Sites not allowed");
            await this.toastService.present(
              'Cash trasanction in Same Sites not allowed',
              1000,
              'warning'
            );
            await this.haptic.warning();
            return;
          } else if (
            this.Entity.p.ExpenseModeOfPayment ==
            this.Entity.p.ModeOfPaymentForIncome
          ) {
            if (this.Entity.p.BankAccountRef == this.Entity.p.IncomeBankRef) {
              // await this.uiUtils.showWarningToster("Same Sites & Same Banks not allowed");
              await this.toastService.present(
                'Same Sites & Same Banks not allowed',
                1000,
                'warning'
              );
              await this.haptic.warning();
              return;
            }
          }
        }
      }

      if (this.Entity.p.CreatedBy == 0) {
        this.Entity.p.CreatedBy = Number(
          this.appStateManage.localStorage.getItem('LoginEmployeeRef')
        );
      }
      this.Entity.p.UpdatedBy = Number(
        this.appStateManage.localStorage.getItem('LoginEmployeeRef')
      );

      this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(
        this.ExpenseDate ?? ''
      );
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
          await this.toastService.present(
            'Expense saved successfully',
            1000,
            'success'
          );
          await this.router.navigate(
            ['/mobile-app/tabs/dashboard/accounting/expenses'],
            { replaceUrl: true }
          );
          await this.haptic.success();
        } else {
          await this.toastService.present(
            'Expense Updated successfully',
            1000,
            'success'
          );
          await this.router.navigate(
            ['/mobile-app/tabs/dashboard/accounting/expenses'],
            { replaceUrl: true }
          );
          await this.haptic.success();
        }
      }
    } catch (error) {
    } finally {
      this.Entity = Expense.CreateNewInstance();
      this.PaymentType = 0;
      this.selectedPaymentType = [];
      await this.getCurrentBalanceByCompanyRef();
      await this.loadingService.hide();
    }
  };

  IsAdvancePayment = async () => {
    if (this.Entity.p.IsAdvancePayment == 1) {
      this.Entity.p.InvoiceAmount = 0;
    } else {
      await this.getTotalInvoiceAmountFromSiteAndRecipientRef();
    }
    this.Entity.p.GivenAmount = 0;
    this.Entity.p.TotalAdvance = 0;
  };

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  public async selectBankBottomsheetNewBank(): Promise<void> {
    try {
      // Format BankList into the structure openSelectModal expects
      const options = this.BankList.map((bank) => ({
        p: {
          Ref: bank.p.BankAccountRef,
          Name: bank.p.BankName,
        },
      }));

      this.openSelectModal(
        options,
        this.selectedBankForNewBank,
        false,
        'Select Bank',
        1,
        (selected) => {
          if (!selected || selected.length === 0) return;

          this.selectedBankForNewBank = selected;
          this.Entity.p.IncomeBankRef = selected[0].p.Ref;
          this.BankNameForNewBank = selected[0].p.Name;
        }
      );
    } catch (error) {}
  }

  public async selectBankBottomsheetForIncome(): Promise<void> {
    try {
      // Format BankList into the structure openSelectModal expects
      // const options = this.BankList.map(bank => ({
      //   p: {
      //     Ref: bank.p.Ref,
      //     Name: bank.p.BankName
      //   }
      // }));
      const options = this.IncomeBankList;

      this.openSelectModal(
        options,
        this.selectedBankForIncome,
        false,
        'Select Bank',
        1,
        (selected) => {
          if (!selected || selected.length === 0) return;

          this.selectedBankForIncome = selected;
          this.Entity.p.IncomeBankRef = selected[0].p.Ref;
          this.BankNameForIncome = selected[0].p.Name;
        }
      );
    } catch (error) {}
  }

  public async selectBankBottomsheet(): Promise<void> {
    try {
      const options = this.BankList.map((bank) => ({
        p: {
          Ref: bank.p.BankAccountRef,
          Name: bank.p.BankName,
        },
      }));
      this.openSelectModal(
        options,
        this.selectedBank,
        false,
        'Select Bank',
        1,
        (selected) => {
          this.selectedBank = selected;
          this.Entity.p.BankAccountRef = selected[0].p.Ref;
          this.BankName = selected[0].p.Name;
        }
      );
    } catch (error) {}
  }

  public async selectModeOfPaymentForIncomeBottomsheet(): Promise<void> {
    try {
      const options = this.ModeofPaymentList.map((item) => ({ p: item }));
      this.openSelectModal(
        options,
        this.selectedModeOfPaymentForIncome,
        false,
        'Select Mode of Payment',
        1,
        (selected) => {
          this.selectedModeOfPaymentForIncome = selected;
          this.Entity.p.ModeOfPaymentForIncome = selected[0].p.Ref;
          this.ModeOfPaymentNameForIncome = selected[0].p.Name;
          this.OnToModeChange();
        }
      );
    } catch (error) {}
  }
  public async selectModeOfPaymentBottomsheet(): Promise<void> {
    try {
      const options = this.ModeofPaymentList.map((item) => ({ p: item }));
      this.openSelectModal(
        options,
        this.selectedModeOfPayment,
        false,
        'Select Mode of Payment',
        1,
        (selected) => {
          this.selectedModeOfPayment = selected;
          this.Entity.p.ExpenseModeOfPayment = selected[0].p.Ref;
          this.ModeOfPaymentName = selected[0].p.Name;
          this.OnModeChange();
        }
      );
    } catch (error) {}
  }
  public async selectPaymentTypeBottomsheet(): Promise<void> {
    try {
      const options = this.TypeofEmployeePaymentList.map((item) => ({
        p: item,
      }));
      this.openSelectModal(
        options,
        this.selectedPaymentType,
        false,
        'Select Type of Employee Payment',
        1,
        (selected) => {
          this.selectedPaymentType = selected;
          this.PaymentType = selected[0].p.Ref;
          this.PaymentTypeName = selected[0].p.Name;
          this.onPaymentTypeSelection();
          this.getTotalInvoiceAmountFromSiteAndRecipientRef();
          this.onRecipientChange();
        }
      );
    } catch (error) {}
  }

  // public async selectRecipientNameBottomsheet(): Promise<void> {
  //   try {
  //     let options = this.RecipientList.map(item => ({
  //       p: {
  //         Ref: item.p.Ref,
  //         Name: item.p.RecipientName + (item.p.PlotName ? ' - ' + item.p.PlotName : '')
  //       }
  //     }));

  //     this.openSelectModal(options, this.selectedRecipientName, false, 'Select Recipient Name', 1, (selected) => {
  //       if (!selected || selected.length === 0) return;

  //       this.selectedRecipientName = selected;
  //       this.Entity.p.RecipientRef = selected[0].p.Ref;
  //       this.RecipientName = selected[0].p.Name;

  //       this.getTotalInvoiceAmountFromSiteAndRecipientRef();
  //       this.onRecipientChange();
  //     });
  //   } catch (error) {
  //   }
  // }
  public async selectRecipientNameBottomsheet(): Promise<void> {
    try {
      let options = this.RecipientList.map((item) => {
        let displayName =
          this.Entity.p.RecipientType === this.DealDoneCustomer
            ? `${item.p.RecipientName} - ${item.p.PlotName || ''}`.trim()
            : item.p.RecipientName;

        return {
          p: {
            Ref: item.p.Ref,
            Name: displayName,
            PlotName: item.p.PlotName || '', // ✅ keep PlotName
          },
        };
      });

      this.openSelectModal(
        options,
        this.selectedRecipientName,
        false,
        'Select Recipient Name',
        1,
        (selected) => {
          if (!selected || selected.length === 0) return;

          this.selectedRecipientName = selected;
          console.log('selected :', selected);
          this.Entity.p.RecipientRef = selected[0].p.Ref;
          this.RecipientName = selected[0].p.Name;
          this.PayerPlotNo = selected[0].p.PlotName || ''; // ✅ now you can directly access it

          // If you need numeric
          // this.PayerPlotNo = Number(this.PlotName) || 0;

          this.getTotalInvoiceAmountFromSiteAndRecipientRef();
          this.onRecipientChange();
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async selectIncomeSubLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.IncomeSubLedgerList;
      this.openSelectModal(
        options,
        this.selectedIncomeSubLedger,
        false,
        'Select Sub Ledger',
        1,
        (selected) => {
          this.selectedIncomeSubLedger = selected;
          this.Entity.p.IncomeSubLedgerRef = selected[0].p.Ref;
          this.IncomeSubLedgerName = selected[0].p.Name;
        }
      );
    } catch (error) {}
  }

  public async selectIncomeLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.LedgerList;
      this.openSelectModal(
        options,
        this.selectedIncomeLedger,
        false,
        'Select Income Ledger',
        1,
        (selected) => {
          this.selectedIncomeLedger = selected;
          this.Entity.p.IncomeLedgerRef = selected[0].p.Ref;
          this.IncomeLedgerName = selected[0].p.Name;
          this.getSubIncomeLedgerListByIncomeLedgerRef(
            this.Entity.p.IncomeLedgerRef
          );
          this.onChangeIncomeLedger();
          this.Entity.p.IncomeSubLedgerRef = 0;
          this.selectedIncomeSubLedger = [];
          this.IncomeSubLedgerName = '';
        }
      );
    } catch (error) {}
  }

  public async selectToWhomTypeBottomsheet(): Promise<void> {
    try {
      const options = this.RecipientTypesList.map((item) => ({ p: item }));
      this.openSelectModal(
        options,
        this.selectedToWhomType,
        false,
        'Select To Whom Type',
        1,
        (selected) => {
          this.selectedToWhomType = selected;
          this.Entity.p.RecipientType = selected[0].p.Ref;
          this.ToWhomTypeName = selected[0].p.Name;
          this.getRecipientListByRecipientTypeRef();
          this.getTotalInvoiceAmountFromSiteAndRecipientRef();
          this.onTypeChange();
        }
      );
    } catch (error) {}
  }
  public async selectSubLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.SubLedgerList;
      this.openSelectModal(
        options,
        this.selectedSubLedger,
        false,
        'Select Sub Ledger',
        1,
        (selected) => {
          this.selectedSubLedger = selected;
          this.Entity.p.SubLedgerRef = selected[0].p.Ref;
          this.SubLedgerName = selected[0].p.Name;
        }
      );
    } catch (error) {}
  }

  public async selectLedgerBottomsheet(): Promise<void> {
    try {
      const options = this.LedgerList;
      this.openSelectModal(
        options,
        this.selectedLedger,
        false,
        'Select Ledger',
        1,
        (selected) => {
          this.selectedLedger = selected;
          this.Entity.p.LedgerRef = selected[0].p.Ref;
          this.LedgerName = selected[0].p.Name;
          this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef);
          this.Entity.p.SubLedgerRef = 0;
          this.selectedSubLedger = [];
          this.SubLedgerName = '';
        }
      );
    } catch (error) {}
  }

  public async selectSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(
        options,
        this.selectedSite,
        false,
        'Select Site',
        1,
        (selected) => {
          this.selectedSite = selected;
          this.Entity.p.SiteRef = selected[0].p.Ref;
          this.SiteName = selected[0].p.Name;
          this.Entity.p.InvoiceAmount = 0;
          this.Entity.p.RemainingAmount = 0;
          this.Entity.p.RecipientType = 0;
          this.Entity.p.RecipientRef = 0;
          this.RecipientList = [];
          this.getRecipientListByRecipientTypeRef();
          this.onSitechange();
        }
      );
    } catch (error) {}
  }

  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(
      dataList,
      selectedItems,
      multiSelect,
      title,
      MaxSelection
    );
    if (selected) updateCallback(selected);
  }
  isDataFilled(): boolean {
    const emptyEntity: Expense = Expense.CreateNewInstance();
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
        message:
          'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {},
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: () => {
              this.router.navigate(
                ['/mobile-app/tabs/dashboard/accounting/expenses'],
                { replaceUrl: true }
              );
              this.haptic.success();
            },
          },
        ],
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses'], {
        replaceUrl: true,
      });
      this.haptic.success();
    }
  };
}
