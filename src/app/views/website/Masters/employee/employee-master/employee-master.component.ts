import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-employee-master',
  standalone: false,
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss'],
})
export class EmployeeMasterComponent  implements OnInit {

   Entity: Employee = Employee.CreateNewInstance();
    MasterList: Employee[] = [];
    DisplayMasterList: Employee[] = [];
    SearchString: string = '';
    SelectedEmployee: Employee = Employee.CreateNewInstance();
    pageSize = 10; // Items per page
    currentPage = 1; // Initialize current page
    total = 0;

  headers: string[] = ['Sr.No.','Role','First Name','Last Name','Email ID','Contact No',' Address',' Gender','Emp Id ','Department Name','Login Status ','Is User ','Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  ngOnInit() {
    this.FormulateMasterList();
  }

  private FormulateMasterList = async () => {
    let lst = await Employee.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList
  }

  onEditClicked = async (item: Employee) => {
    this.SelectedEmployee = item.GetEditableVersion();
    Employee.SetCurrentInstance(this.SelectedEmployee);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Employee_Master_Details']);
  }

  onDeleteClicked = async (employee: Employee) => {
    debugger
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Employee?`,
      async () => {
        await employee.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Employee ${employee.p.FirstName} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
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

  AddEmployee(){
    this.router.navigate(['/homepage/Website/Employee_Master_Details']);
   }

}
