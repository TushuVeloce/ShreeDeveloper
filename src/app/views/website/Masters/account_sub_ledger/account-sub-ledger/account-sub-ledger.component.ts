import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-account-sub-ledger',
  standalone: false,
  templateUrl: './account-sub-ledger.component.html',
  styleUrls: ['./account-sub-ledger.component.scss'],
})
export class AccountSubLedgerComponent  implements OnInit {
Entity: SubLedger = SubLedger.CreateNewInstance();
  MasterList: SubLedger[] = [];
  DisplayMasterList: SubLedger[] = [];
  SearchString: string = '';
  SelectedSubLedger: SubLedger = SubLedger.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Ledger Name', 'Sub Ledger Name', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getSubLedgerListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getSubLedgerListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: SubLedger) => {
    this.SelectedSubLedger = item.GetEditableVersion();
    SubLedger.SetCurrentInstance(this.SelectedSubLedger);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/SubLedger_Master_Details']);
  };

  onDeleteClicked = async (SubLedger: SubLedger) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this SubLedger?`,
      async () => {
        await SubLedger.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `SubLedger ${SubLedger.p.Name} has been deleted!`
          );
          await this.getSubLedgerListByCompanyRef();
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

  AddSubLedger = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Account_Sub_Ledger_Details']);
  }
}

