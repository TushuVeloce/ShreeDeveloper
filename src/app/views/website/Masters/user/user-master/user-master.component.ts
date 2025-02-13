import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/domain/entities/website/masters/user/user';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-user-master',
  standalone: false,
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss'],
})
export class UserMasterComponent implements OnInit {

  Entity: User = User.CreateNewInstance();
  MasterList: User[] = [];
  DisplayMasterList: User[] = [];
  SearchString: string = '';
  SelectedUser: User = User.CreateNewInstance();
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  headers: string[] = ['Sr.No.', 'Email Id', 'Contact No', 'Default Password', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  ngOnInit() {
    this.FormulateMasterList();
  }

  private FormulateMasterList = async () => {
    let lst = await User.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList
  }

  onEditClicked = async (item: User) => {
    this.SelectedUser = item.GetEditableVersion();
    User.SetCurrentInstance(this.SelectedUser);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/User_Master_Details']);
  }

  onDeleteClicked = async (User: User) => {
    debugger
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
          Are you sure that you want to DELETE this User?`,
      async () => {
        await User.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`User ${User.p.EmailId} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
        });
      });
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  AddUser() {
    this.router.navigate(['/homepage/Website/User_Master_Details']);
  }

}
