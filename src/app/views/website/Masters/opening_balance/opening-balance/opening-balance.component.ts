import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationFeatures,
  OpeningBalanceModeOfPayments,
} from 'src/app/classes/domain/domainenums/domainenums';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessService } from 'src/app/services/feature-access.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-opening-balance',
  standalone: false,
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss'],
})
export class OpeningBalanceComponent implements OnInit {
  Entity: OpeningBalance = OpeningBalance.CreateNewInstance();
  MasterList: OpeningBalance[] = [];
  DisplayMasterList: OpeningBalance[] = [];
  SearchString: string = '';
  SelectedOpeningBalance: OpeningBalance = OpeningBalance.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  Cash = OpeningBalanceModeOfPayments.Cash;
  Cheque = OpeningBalanceModeOfPayments.Cheque;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  // headers: string[] = [ 'Opening Date', 'Mode of Payment', 'Bank Name', 'Opening Bal. Amount', 'Initial Balance'];
  headers: string[] = [];
  featureRef: ApplicationFeatures = ApplicationFeatures.OpeningBalanceMaster;
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    public access: FeatureAccessService
  ) {
    effect(async () => {
      await this.getOpeningBalanceListByCompanyRef();
      await this.getCurrentBalanceByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.access.refresh();
    this.headers = [
      'Opening Date',
      'Mode of Payment',
      'Bank Name',
      'Opening Bal. Amount',
      'Initial Balance',
    ];
  }

  getOpeningBalanceListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

  onEditClicked = async (item: OpeningBalance) => {
    this.SelectedOpeningBalance = item.GetEditableVersion();
    OpeningBalance.SetCurrentInstance(this.SelectedOpeningBalance);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate([
      '/homepage/Website/Opening_Balance_Master_Details',
    ]);
  };

  get totalOpeningBalanceAmount(): number {
    return this.DisplayMasterList.reduce(
      (sum, item) => sum + (item.p.OpeningBalanceAmount || 0),
      0
    );
  }

  get totalInitailBalanceAmount(): number {
    return this.DisplayMasterList.reduce(
      (sum, item) => sum + (item.p.InitialBalance || 0),
      0
    );
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    if (lst.length > 0) {
      this.Entity.p.ShreesBalance = lst[0].p.ShreesBalance;
    }
  };

  onDeleteClicked = async (OpeningBalance: OpeningBalance) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Opening Balance?`,
      async () => {
        await OpeningBalance.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Opening Balance of${OpeningBalance.p.BankName} has been deleted!`
          );
          await this.getOpeningBalanceListByCompanyRef();
          await this.getCurrentBalanceByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  };

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1; // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddOpeningBalance = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Opening_Balance_Master_Details']);
  };
}
