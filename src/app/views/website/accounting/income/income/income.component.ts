import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-income',
  standalone: false,
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  Entity: Income = Income.CreateNewInstance();
  MasterList: Income[] = [];
  DisplayMasterList: Income[] = [];
  SearchString: string = '';
  SelectedIncome: Income = Income.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Date', 'Site Name', 'Ledger', 'Sub Ledger', 'Reason', 'Income Amount', 'Shree Balance', 'Mode of Payment', 'Narration', 'Action'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private DateconversionService: DateconversionService,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getIncomeListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getIncomeListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Income.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: Income) => {
    this.SelectedIncome = item.GetEditableVersion();
    Income.SetCurrentInstance(this.SelectedIncome);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Income_Details']);
  };

  onDeleteClicked = async (Income: Income) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Income?`,
      async () => {
        await Income.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Income ${Income.p.SubLedgerRef} has been deleted!`
          );
          await this.getIncomeListByCompanyRef();
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
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddIncome = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Income_Details']);
  }
}

