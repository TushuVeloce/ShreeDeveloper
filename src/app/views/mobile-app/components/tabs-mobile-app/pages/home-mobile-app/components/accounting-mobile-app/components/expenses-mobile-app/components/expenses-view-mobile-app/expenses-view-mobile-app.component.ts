import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-expenses-view-mobile-app',
  templateUrl: './expenses-view-mobile-app.component.html',
  styleUrls: ['./expenses-view-mobile-app.component.scss'],
  standalone: false
})
export class ExpensesViewMobileAppComponent implements OnInit {

  Entity: Expense = Expense.CreateNewInstance();
  MasterList: Expense[] = [];
  DisplayMasterList: Expense[] = [];
  SearchString: string = '';
  SelectedExpense: Expense = Expense.CreateNewInstance();
  CustomerRef: number = 0;
  printheaders: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Recipient Name', 'Reason', 'Bill Amount', 'Given Amount', 'Remaining Amount', 'Shree Balance', 'Mode of Payment'];

  companyRef = 0;
  modalOpen = false;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private pdfService: PDFService
  ) { }

  ngOnInit = async () => {
    // await this.loadExpenseIfEmployeeExists();
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
    await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses/edit']);
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
                await this.loadingService.show();
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Expense ${item.p.RecipientName} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
              } catch (err) {
                // console.error('Error deleting Expense:', err);
                // await this.toastService.present('Failed to delete Expense', 1000, 'danger');
                // await this.haptic.error();
              }
              finally {
                await this.getExpenseListByCompanyRef();
                await this.loadingService.hide();
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


  // navigateToPrint = async (item: Expense) => {
  //   this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses/print'], {
  //     state: { printData: item.GetEditableVersion() }
  //   });
  // }

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
    this.router.navigate(['/mobile-app/tabs/dashboard/accounting/expenses/add']);
  }

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  async handlePrintOrShare() {
    if (this.DisplayMasterList.length == 0) {
      await this.toastService.present('No Expenses Records Found', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (!this.PrintContainer) return;
    await this.pdfService.generatePdfAndHandleAction(this.PrintContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
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
