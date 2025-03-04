import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-material-master',
  standalone: false,
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.scss'],

})
export class MaterialMasterComponent implements OnInit {
  Entity: Material = Material.CreateNewInstance();
  MasterList: Material[] = [];
  DisplayMasterList: Material[] = [];
  SearchString: string = '';
  SelectedMaterial: Material = Material.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Code', 'Material Name', 'Material Unit', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(() => {
      this.getMaterialListByCompanyRef()
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    // await this.FormulateMaterialList();
    // this.DisplayMasterList = [];
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }
  // private FormulateMaterialList = async () => {
  //   let lst = await Material.FetchEntireList(
  //     async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
  //   );
  //   this.MasterList = lst;
  //   console.log('MasterList :', this.MasterList);
  //   this.DisplayMasterList = this.MasterList;
  //   this.loadPaginationData();
  //   // console.log(this.DisplayMasterList);
  // };

  getMaterialListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Material.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    console.log('MaterialList :', this.MasterList);

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }
  onEditClicked = async (item: Material) => {
    // let props = Object.assign(MaterialProps.Blank(),item.p);
    // this.SelectedMaterial = Material.CreateInstance(props,true);

    this.SelectedMaterial = item.GetEditableVersion();

    Material.SetCurrentInstance(this.SelectedMaterial);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Material_Master_Details']);
  };

  onDeleteClicked = async (material: Material) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Material?`,
      async () => {
        await material.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Material ${material.p.Name} has been deleted!`
          );
          await this.getMaterialListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
          // await this.FormulateMaterialList();

        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  async AddMaterial() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Material_Master_Details']);
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
