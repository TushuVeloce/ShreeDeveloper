import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';


@Component({
  selector: 'app-department-master',
  standalone: false,
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.scss'],
})
export class DepartmentMasterComponent implements OnInit {

  Entity: Department = Department.CreateNewInstance();
  MasterList: Department[] = [];
  DisplayMasterList: Department[] = [];
  SearchString: string = '';
  SelectedDepartment: Department = Department.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = [ 'Name', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement, private screenSizeService: ScreenSizeService) {
    effect(() => {
      this.getDepartmentListByCompanyRef()
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getDepartmentListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Department.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Department) => {
    this.SelectedDepartment = item.GetEditableVersion();
    Department.SetCurrentInstance(this.SelectedDepartment);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Department_Master_Details']);
  }

  onDeleteClicked = async (Department: Department) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Department?`,
      async () => {
        await Department.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Department ${Department.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          await this.getDepartmentListByCompanyRef();
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

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1;   // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  AddDepartment = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Department_Master_Details']);
  }
}
