import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-company-master',
  standalone: false,
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.scss'],
})
export class CompanyMasterComponent implements OnInit {

  Entity: Company = Company.CreateNewInstance();
  MasterList: Company[] = [];
  DisplayMasterList: Company[] = [];
  SearchString: string = '';
  SelectedCompany: Company = Company.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  headers: string[] = ['Sr.No.', 'Name', 'Owner Names', 'Contacts','Country ','State ','City ',' GST No',' Pan No', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.FormulateMasterList();
    this.loadPaginationData();
  }

  private FormulateMasterList = async () => {
    let lst = await Company.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList
    console.log('DisplayMasterList :', this.DisplayMasterList);
    this.loadPaginationData();
  }

  onEditClicked = async (item: Company) => {
    this.SelectedCompany = item.GetEditableVersion();
    Company.SetCurrentInstance(this.SelectedCompany);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Company_Master_Details']);
  }

  onDeleteClicked = async (Company: Company) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Company?`,
      async () => {
        await Company.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Company ${Company.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          this.FormulateMasterList();
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

  AddCompany() {
    this.router.navigate(['/homepage/Website/Company_Master_Details']);
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

}
