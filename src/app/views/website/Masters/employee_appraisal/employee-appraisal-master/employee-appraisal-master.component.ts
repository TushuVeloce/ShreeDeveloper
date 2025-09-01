import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeAppraisal } from 'src/app/classes/domain/entities/website/masters/employeeappraisal/employeeappraisal';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';


@Component({
  selector: 'app-employee-appraisal-master',
  standalone: false,
  templateUrl: './employee-appraisal-master.component.html',
  styleUrls: ['./employee-appraisal-master.component.scss'],
})
export class EmployeeAppraisalMasterComponent implements OnInit {

  Entity: EmployeeAppraisal = EmployeeAppraisal.CreateNewInstance();
  MasterList: EmployeeAppraisal[] = [];
  DisplayMasterList: EmployeeAppraisal[] = [];
  SearchString: string = '';
  SelectedEmployeeAppraisal: EmployeeAppraisal = EmployeeAppraisal.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Name', 'Company Name', 'Appraisal Date', 'Employee Name', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getEmployeeAppraisalListByCompanyRef()
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
  }


  getEmployeeAppraisalListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await EmployeeAppraisal.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: EmployeeAppraisal) => {
    this.SelectedEmployeeAppraisal = item.GetEditableVersion();
    EmployeeAppraisal.SetCurrentInstance(this.SelectedEmployeeAppraisal);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Employee_Appraisal_Master_Details']);
  }

  onDeleteClicked = async (EmployeeAppraisal: EmployeeAppraisal) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Employee Appraisal?`,
      async () => {
        await EmployeeAppraisal.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Employee Appraisal ${EmployeeAppraisal.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          await this.getEmployeeAppraisalListByCompanyRef();
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

  AddEmployeeAppraisal = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Employee_Appraisal_Master_Details']);
  }
}
