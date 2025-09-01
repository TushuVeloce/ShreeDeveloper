import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-user-role-master',
  standalone: false,
  templateUrl: './user-role-master.component.html',
  styleUrls: ['./user-role-master.component.scss'],
})
export class UserRoleMasterComponent implements OnInit {
  Entity: UserRole = UserRole.CreateNewInstance();
  MasterList: UserRole[] = [];
  DisplayMasterList: UserRole[] = [];
  SearchString: string = '';
  SelectedMaterial: UserRole = UserRole.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Role', 'Action'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(() => {
      this.getUserRoleListByCompanyRef();
    });
  }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    // this.FormulateMaterialList();
  }

  getUserRoleListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
      let lst = await UserRole.FetchEntireListByCompanyRef(
        this.companyRef(),
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (userrole: UserRole) => {
    this.SelectedMaterial = userrole.GetEditableVersion();
    UserRole.SetCurrentInstance(this.SelectedMaterial);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/User_Role_Master_Details']);
  };

  onDeleteClicked = async (userrole: UserRole) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Company?`,
      async () => {
        await userrole.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Company ${userrole.p.Name} has been deleted!`
          );
          this.SearchString = '';
          this.loadPaginationData();
          await this.getUserRoleListByCompanyRef();
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

  AddUserRole = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/User_Role_Master_Details']);
  }
}
