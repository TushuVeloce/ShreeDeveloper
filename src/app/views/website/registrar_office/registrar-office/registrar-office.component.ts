import { Component, OnInit,effect  } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { RegistrarOffice } from 'src/app/classes/domain/entities/website/registraroffice/registraroffice';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-registrar-office',
  standalone: false,
  templateUrl: './registrar-office.component.html',
  styleUrls: ['./registrar-office.component.scss'],
})
export class RegistrarOfficeComponent  implements OnInit {

  Entity: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  MasterList: RegistrarOffice[] = [];
  DisplayMasterList: RegistrarOffice[] = [];
  SiteList: Site[] = [];
  CustomerList: CustomerEnquiry[] = [];
  PlotNoList: Plot[] = [];
  SearchString: string = '';
  SelectedRegistrarOffice: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  
  headers: string[] = ['Sr.No.', 'Name', 'Company Name', 'Action'];
  
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getRegistrarOfficeListByCompanyRef()
    });
   }

  async ngOnInit() {
    await this.getSiteListByCompanyRef();
    await this.getCustomerListByCompanyRef();
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
  }
  
  // private FormulateMasterList = async () => {
  //   let lst = await RegistrarOffice.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.MasterList = lst;
  //   this.DisplayMasterList = this.MasterList
  //   this.loadPaginationData();
  // }

  getSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    this.loadPaginationData();
  }
  getCustomerListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.CustomerList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await CustomerEnquiry.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CustomerList = lst;
    this.loadPaginationData();
  }

  

   getRegistrarOfficeListByCompanyRef = async () => {
      this.MasterList = [];
      this.DisplayMasterList = [];
      if(this.companyRef()<=0){
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
        let lst = await RegistrarOffice.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
        this.MasterList = lst;
        this.DisplayMasterList = this.MasterList;
      this.loadPaginationData();
    }

    

  onEditClicked = async (item: RegistrarOffice) => {
    this.SelectedRegistrarOffice = item.GetEditableVersion();
    RegistrarOffice.SetCurrentInstance(this.SelectedRegistrarOffice);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Registrar_Office_Details']);
  }

  onDeleteClicked = async (RegistrarOffice: RegistrarOffice) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Registrar Office?`,
      async () => {
        await RegistrarOffice.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Registrar Office ${RegistrarOffice.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
        await this.getRegistrarOfficeListByCompanyRef();
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

  async AddRegistrarOffice() {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Registrar_Office_Details']);
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
