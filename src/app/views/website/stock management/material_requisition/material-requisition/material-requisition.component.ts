import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { MaterialRequisition } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/materialrequisition';
import { RequiredMaterial } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-material-requisition',
  templateUrl: './material-requisition.component.html',
  styleUrls: ['./material-requisition.component.scss'],
  standalone: false,
})
export class MaterialRequisitionComponent  implements OnInit {

  Entity: MaterialRequisition = MaterialRequisition.CreateNewInstance();
  MasterList: MaterialRequisition[] = [];
  DisplayMasterList: MaterialRequisition[] = [];
  list:[]=[]
  SiteList: Site[] = [];
  SearchString: string = '';
  SelectedMaterialRequisition: MaterialRequisition = MaterialRequisition.CreateNewInstance();
  StatusList = DomainEnums.MaterialRequisitionStatusesList(true,);
  CustomerRef: number = 0;
  pageSize = 10;
  currentPage = 1;
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  headers: string[] = ['Sr.No.', 'Date', 'Site name', 'Material Name', 'Unit','Estimated Qty','Status', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,private DateconversionService: DateconversionService,private dtu: DTU,
  ) {
    effect(async () => {
      // this.getMaterialListByCompanyRef()
       this.getSiteListByCompanyRef()
      await this.getMaterialRequisitionListByCompanyRef();
    });
  }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled();
  }

   getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    this.Entity.p.SiteRef = this.SiteList[0].p.Ref
  }

  getMaterialRequisitionListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MaterialRequisition.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getRequisitionListByAllFilters = async () => {
      this.MasterList = [];
      this.DisplayMasterList = [];
      // let Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date);
      if (this.companyRef() <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      console.log(' this.Entity.p.Status, this.Entity.p.SiteRef :',  this.Entity.p.Status, this.Entity.p.SiteRef);
      let lst = await MaterialRequisition.FetchEntireListByAllFilters(this.companyRef(), this.Entity.p.Status, this.Entity.p.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList;
      this.loadPaginationData();
    }

   // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddMaterialRequisition = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    await this.router.navigate(['/homepage/Website/Material_Requisition_Details']);
  }

  onEditClicked = async (item: MaterialRequisition) => {
    this.SelectedMaterialRequisition = item.GetEditableVersion();
    MaterialRequisition.SetCurrentInstance(this.SelectedMaterialRequisition);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Material_Requisition_Details']);
  };

  onDeleteClicked = async (MaterialRequisition: MaterialRequisition) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Material Requisition?`,
      async () => {
        await MaterialRequisition.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `MaterialRequisition ${MaterialRequisition.p.Date} has been deleted!`
          );
          await this.getMaterialRequisitionListByCompanyRef();
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