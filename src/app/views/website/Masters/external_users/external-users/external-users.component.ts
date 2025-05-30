import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalUsers } from 'src/app/classes/domain/entities/website/masters/externalusers/externalusers';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-external-users',
  standalone: false,
  templateUrl: './external-users.component.html',
  styleUrls: ['./external-users.component.scss'],
})
export class ExternalUsersComponent implements OnInit {

  Entity: ExternalUsers = ExternalUsers.CreateNewInstance();
  MasterList: ExternalUsers[] = [];
  DisplayMasterList: ExternalUsers[] = [];
  SearchString: string = '';
  SelectedExternalUsers: ExternalUsers = ExternalUsers.CreateNewInstance();
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'User Name', 'User ID/Email Id', 'Contact No', 'Department', 'User Role', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getExternalUsersListByCompanyRef()
    });
  }

  ngOnInit() {
    // this.FormulateMasterList();
    this.appStateManage.setDropdownDisabled(false);
  }

  getExternalUsersListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ExternalUsers.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: ExternalUsers) => {
    this.SelectedExternalUsers = item.GetEditableVersion();
    ExternalUsers.SetCurrentInstance(this.SelectedExternalUsers);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/External_Users_Details']);
  }

  onDeleteClicked = async (User: ExternalUsers) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
          Are you sure that you want to DELETE this User?`,
      async () => {
        await User.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`User ${User.p.EmailId} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          await this.getExternalUsersListByCompanyRef();
        });
      });
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  AddExternalUser = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/External_Users_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.EmailId.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

}
