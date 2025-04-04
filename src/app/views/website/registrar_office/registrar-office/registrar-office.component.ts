import { Component, OnInit,effect  } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
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
  CustomerList: CustomerFollowUp[] = [];
  PlotNoList: Plot[] = [];
  SearchString: string = '';
  SelectedRegistrarOffice: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  SiteRef : number = 0;
  headers: string[] = ['Sr.No.','Customer', 'Cheque', 'Witness 1','Agreement to Sale','Sale Deed','Talathi','7/12	','Spiral','Client Submit	', 'Action'];
  
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getSiteListByCompanyRef();
    });
   }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
  } 
    
  // get SiteList With Company Ref //
  getSiteListByCompanyRef = async () => {
    this.PlotNoList = [];
    this.SiteList = [];
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    this.loadPaginationData();
  }


  // get PlotList With Site Ref //

getPlotListBySiteRef = async (siteRef: number) => {
  this.MasterList = [];
  this.DisplayMasterList = [];
  this.PlotNoList = [];
  this.Entity.p.PlotRef= 0 ;
  if (siteRef <= 0) {
    await this.uiUtils.showWarningToster(`Please Select Site`);
    return
  }
  let lst = await Plot.FetchEntireListBySiteRef(siteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  this.PlotNoList = lst.filter(plot => plot.p.CurrentBookingRemark === 50);
  this.loadPaginationData(); 
}


  // get CustomerList With Plot Ref //

  getRegistrarOfficeListByPlotRef = async (PlotRef: number) => {
    this.DisplayMasterList = [];
    if (PlotRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Plot`);
      return
    }
    let lst = await RegistrarOffice.FetchEntireListByPlotRef(PlotRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
        this.MasterList = lst;
        this.DisplayMasterList = this.MasterList;
        console.log('DisplayMasterList :', this.DisplayMasterList);
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
          await this.uiUtils.showSuccessToster(`Registrar Office ${RegistrarOffice.p.CustomerName} has been deleted!`);
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

  async AddRegistrarOffice() {
    this.router.navigate(['/homepage/Website/Registrar_Office_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1 ||
         data.p.CustomerName.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

}
