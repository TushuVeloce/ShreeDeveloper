import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-expense-mobile',
  templateUrl: './expense-mobile.page.html',
  styleUrls: ['./expense-mobile.page.scss'],
  standalone:false
})
export class ExpenseMobilePage implements OnInit {

  Entity: Expense = Expense.CreateNewInstance();
  MasterList: Expense[] = [];
  DisplayMasterList: Expense[] = [];
  SearchString: string = '';
  SelectedExpense: Expense = Expense.CreateNewInstance();
  CustomerRef: number = 0;

  companyRef = 0;
  modalOpen = false;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
    private utils: Utils,
  ) { }

  ngOnInit = async () => {
    await this.loadExpenseIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadExpenseIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadExpenseIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadExpenseIfEmployeeExists() {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      await this.getExpenseListByCompanyRef();
    } catch (error) {
      console.error('Error in loadExpenseIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Expense', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getExpenseListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Expense.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
    });
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  onEditClicked = async (item: Expense) => {
    this.SelectedExpense = item.GetEditableVersion();
    Expense.SetCurrentInstance(this.SelectedExpense);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/accounting/expense/edit']);
  };

  async onDeleteClicked(item: Expense) {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Expense?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Deletion cancelled.');
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Expense ${item.p.RecipientName} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getExpenseListByCompanyRef();
              } catch (err) {
                console.error('Error deleting Expense:', err);
                await this.toastService.present('Failed to delete Expense', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error showing delete confirmation:', error);
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }


  navigateToPrint = async (item: Expense) => {
    this.router.navigate(['/mobileapp/tabs/dashboard/accounting/expense/print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddExpense = () => {
    if (this.companyRef <= 0) {
      //  this.uiUtils.showWarningToster('Please select company');
      this.toastService.present('Please select company', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.router.navigate(['/mobileapp/tabs/dashboard/accounting/expense/add']);
  }

  printReport(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin?.document.write(`
      <html>
        <head>
          <title>Expense</title>
         <style>
         * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: sans-serif;
           }
            table {
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              border: 1px solid  rgb(169, 167, 167);
              text-align: center;
              padding: 15px;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
        </body>
      </html>
    `);
      popupWin?.document.close();
    }
  }

  openModal(Expense: any) {
    // console.log('Expense: any, ExpenseItem: any :', Expense, ExpenseItem);
    this.SelectedExpense = Expense;
    // this.SelectedExpense = ExpenseItem;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedExpense = Expense.CreateNewInstance();
  }
}
