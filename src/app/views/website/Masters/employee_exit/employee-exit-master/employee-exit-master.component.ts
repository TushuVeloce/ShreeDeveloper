import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeExit } from 'src/app/classes/domain/entities/website/masters/employeeexit/employeeexit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-employee-exit-master',
  standalone: false,
  templateUrl: './employee-exit-master.component.html',
  styleUrls: ['./employee-exit-master.component.scss'],
})
export class EmployeeExitMasterComponent implements OnInit {
  Entity: EmployeeExit = EmployeeExit.CreateNewInstance();
  MasterList: EmployeeExit[] = [];
  DisplayMasterList: EmployeeExit[] = [];
  SearchString: string = '';
  SelectedEmployeeExit: EmployeeExit = EmployeeExit.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Name', 'Company Name', 'Exit Date', 'Employee Name', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getEmployeeExitListByCompanyRef()
    });
  }

  async ngOnInit() {
    // await this.FormulateMasterList();
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
  }

  // private FormulateMasterList = async () => {
  //   let lst = await EmployeeExit.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList
  //   this.loadPaginationData();
  // }

  getEmployeeExitListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await EmployeeExit.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: EmployeeExit) => {
    this.SelectedEmployeeExit = item.GetEditableVersion();
    EmployeeExit.SetCurrentInstance(this.SelectedEmployeeExit);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Employee_Exit_Master_Details']);
  }

  onDeleteClicked = async (EmployeeExit: EmployeeExit) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Employee Exit?`,
      async () => {
        await EmployeeExit.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Employee Exit ${EmployeeExit.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          await this.getEmployeeExitListByCompanyRef();
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

  AddEmployeeExit = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Employee_Exit_Master_Details']);
  }

}
