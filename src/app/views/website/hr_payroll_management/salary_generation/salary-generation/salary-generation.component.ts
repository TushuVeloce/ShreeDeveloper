import { Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { SalaryGeneration, SalaryGenerationProps } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Salary_Generation/salarygeneration';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';

@Component({
  selector: 'app-salary-generation',
  standalone: false,
  templateUrl: './salary-generation.component.html',
  styleUrls: ['./salary-generation.component.scss'],
})
export class SalaryGenerationComponent  implements OnInit {
  
  @ViewChild('printSection') printSection!: ElementRef;

  Entity: SalaryGeneration = SalaryGeneration.CreateNewInstance();
  MasterList: SalaryGeneration[] = [];
  DisplayMasterList: SalaryGeneration[] = [];
  SearchString: string = '';
  SelectedSalary: SalaryGeneration = SalaryGeneration.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  CompnyList: Company[] = [];
  EmployeeList: Employee[] = [];
  CompanyAddress : string = ''
  CompanyEmail : string = ''
  EmployeeDesignation : string = ''
  EmployeeBankName : string = ''
  EmployeeBankBranch : string = ''
  EmployeeBankAccountNo : string = ''
  EmployeeBankIFSCCode : string = ''
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  isModalVisible = false;

 
  headers: string[] = ['Sr.No.', 'Employee Name', 'Month', 'Total Working Days','Basic Salary','Gross Total','Total Deduction','Net Salary', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getSalaryListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.CompnyList = await  Company.FetchEntireList();
    this.EmployeeList = await  Employee.FetchEntireList();
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  openSalarySlipModal = (SalaryGeneration:SalaryGeneration) => {
  this.isModalVisible = true;
  console.log('SalaryGeneration :', SalaryGeneration);
  this.Entity = SalaryGeneration
  if(this.Entity.p.CompanyRef != 0){
    const companydetails = this.CompnyList.find(item => item.p.Ref == this.Entity.p.CompanyRef);{
      this.CompanyAddress = companydetails?.p?.AddressLine1 || '';    
      this.CompanyEmail = companydetails?.p?.EmailId || '';
    }
  }
  if(this.Entity.p.EmployeeRef != 0){
    const employeedetails = this.EmployeeList.find(item => item.p.Ref == this.Entity.p.EmployeeRef);{
    console.log('employeedetails :', employeedetails);
      this.EmployeeDesignation = employeedetails?.p.DesignationName || '';    
      this.EmployeeBankName = employeedetails?.p?.BankName || '';
      this.EmployeeBankBranch = employeedetails?.p?.BranchName || '';
      this.EmployeeBankAccountNo = employeedetails?.p?.BanckAccountNo || '';
      this.EmployeeBankIFSCCode = employeedetails?.p?.IFSC || '';
    }
  }
  }

  getSalaryListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await SalaryGeneration.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    console.log('DisplayMasterList :', this.DisplayMasterList);
    this.loadPaginationData();
  }

  onEditClicked = async (item: SalaryGeneration) => {
    this.SelectedSalary = item.GetEditableVersion();
    SalaryGeneration.SetCurrentInstance(this.SelectedSalary);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Salary_Generation_Details']);
  };

  onDeleteClicked = async (SalaryGeneration: SalaryGeneration) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Salary Generation?`,
      async () => {
        await SalaryGeneration.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Salary Generation of ${SalaryGeneration.p.EmployeeName} has been deleted!`
          );
          await this.getSalaryListByCompanyRef();
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

  AddSalaryDetails = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Salary_Generation_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

  printPage() {
    window.print();
  }
}
