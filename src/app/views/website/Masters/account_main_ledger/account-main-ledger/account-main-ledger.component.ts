import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-account-main-ledger',
  standalone: false,
  templateUrl: './account-main-ledger.component.html',
  styleUrls: ['./account-main-ledger.component.scss'],
})
export class AccountMainLedgerComponent implements OnInit {
  Entity: Ledger = Ledger.CreateNewInstance();
  MasterList: Ledger[] = [];
  DisplayMasterList: Ledger[] = [];
  SearchString: string = '';
  SelectedLedger: Ledger = Ledger.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Ledger Name', 'Action'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getLedgerListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getLedgerListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Ledger) => {
    this.SelectedLedger = item.GetEditableVersion();
    Ledger.SetCurrentInstance(this.SelectedLedger);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Account_Main_Ledger_Details']);
  };

  onDeleteClicked = async (Ledger: Ledger) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Ledger?`,
      async () => {
        await Ledger.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Ledger ${Ledger.p.Name} has been deleted!`
          );
          await this.getLedgerListByCompanyRef();
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

  AddLedger = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Account_Main_Ledger_Details']);
  }
}

