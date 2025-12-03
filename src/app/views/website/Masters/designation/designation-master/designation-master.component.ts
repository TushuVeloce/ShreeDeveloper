import { Component, effect, OnInit } from '@angular/core';
import { Designation } from 'src/app/classes/domain/entities/website/masters/designation/designation';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { FeatureAccessService } from 'src/app/services/feature-access.service';

@Component({
  selector: 'app-designation-master',
  standalone: false,
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss'],
})
export class DesignationMasterComponent implements OnInit {
  Entity: Designation = Designation.CreateNewInstance();
  MasterList: Designation[] = [];
  DisplayMasterList: Designation[] = [];
  SearchString: string = '';
  SelectedDesignation: Designation = Designation.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  DepartmentList: Department[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  // headers: string[] = [ 'Designation', 'Seniority Level', 'Action'];
  headers: string[] = [];
  featureRef: ApplicationFeatures = ApplicationFeatures.DesignationMaster;
  showActionColumn = false;
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    public access: FeatureAccessService
  ) {
    effect(() => {
      this.getDepartmentListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.access.refresh();
    this.showActionColumn =
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    this.headers = [
      'Designation',
      'Seniority Level',
      ...(this.showActionColumn ? ['Action'] : []),
    ];
  }
  public getDepartmentListByCompanyRef = async () => {
    this.Entity.p.DepartmentRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Department.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.DepartmentList = lst;
    if (this.DepartmentList.length > 0) {
      this.Entity.p.DepartmentRef = this.DepartmentList[0].p.Ref;
      this.getDesignationListByDepartmentRef();
    } else {
      this.DisplayMasterList = [];
    }
  };

  getDesignationListByDepartmentRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.DepartmentRef <= 0) {
      await this.uiUtils.showErrorToster('Department not Selected');
      return;
    }
    let lst = await Designation.FetchEntireListByDepartmentRef(
      this.Entity.p.DepartmentRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: Designation) => {
    // let props = Object.assign(DesignationProps.Blank(),item.p);
    // this.SelectedDesignation = Designation.CreateInstance(props,true);

    this.SelectedDesignation = item.GetEditableVersion();

    Designation.SetCurrentInstance(this.SelectedDesignation);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate([
      '/homepage/Website/Designation_Master_Details',
    ]);
  };

  onDeleteClicked = async (Designation: Designation) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this Designation?`,
      async () => {
        await Designation.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Designation ${Designation.p.Name} has been deleted!`
          );
          await this.getDesignationListByDepartmentRef();
          this.SearchString = '';
          this.loadPaginationData();
          // await this.FormulateDesignationList();
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
  };

  // 🔑 Whenever filteredList event is received
  onFilteredList(list: any[]) {
    this.DisplayMasterList = list;
    this.currentPage = 1; // reset to first page after filtering

    this.loadPaginationData();
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddDesignation = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Designation_Master_Details']);
  };
}
