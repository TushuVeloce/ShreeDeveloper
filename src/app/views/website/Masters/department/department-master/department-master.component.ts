import { Component, OnInit,effect  } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  
  headers: string[] = ['Sr.No.', 'Name', 'Company Name', 'Action'];
  
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getDepartmentListByCompanyRef()
    });
   }

  async ngOnInit() {
    // await this.FormulateMasterList();
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
  }
  
  // private FormulateMasterList = async () => {
  //   let lst = await Department.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList
  //   this.loadPaginationData();
  // }

   getDepartmentListByCompanyRef = async () => {
      this.MasterList = [];
      this.DisplayMasterList = [];
      if(this.companyRef()<=0){
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

  get paginatedList () {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange  = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  async AddDepartment() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Department_Master_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1 ||
         data.p.CompanyName.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

}
