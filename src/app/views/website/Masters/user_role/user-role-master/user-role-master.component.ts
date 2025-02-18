import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
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

  headers: string[] = ['Sr.No.', 'Role', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  ngOnInit() {
    this.FormulateMaterialList();
  }

  private FormulateMaterialList = async () => {
    let lst = await UserRole.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList
    // console.log(this.DisplayMasterList);
  }

  onEditClicked = async (userrole: UserRole) => {

    this.SelectedMaterial = userrole.GetEditableVersion();

    UserRole.SetCurrentInstance(this.SelectedMaterial);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/User_Role_Master_Details']);
  }

  onDeleteClicked = async (userrole: UserRole) => {
    debugger
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Company?`,
      async () => {
        await userrole.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Company ${userrole.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          await this.FormulateMaterialList();

        });
      });
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  get paginatedList () {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange  = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }
  AddUserRole() {
    this.router.navigate(['/homepage/Website/User_Role_Master_Details']);
  }

}
