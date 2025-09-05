import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRemarks } from 'src/app/classes/domain/domainenums/domainenums';
import { CustomerEnquiry } from 'src/app/classes/domain/entities/website/customer_management/customerenquiry/customerenquiry';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { RegistrarOffice } from 'src/app/classes/domain/entities/website/registraroffice/registraroffice';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-registrar-office',
  standalone: false,
  templateUrl: './registrar-office.component.html',
  styleUrls: ['./registrar-office.component.scss'],
})
export class RegistrarOfficeComponent implements OnInit {

  Entity: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  MasterList: RegistrarOffice[] = [];
  DisplayMasterList: RegistrarOffice[] = [];
  SiteList: Site[] = [];
  CustomerList: RegistrarOffice[] = [];
  PlotNoList: Plot[] = [];
  SearchString: string = '';
  SelectedRegistrarOffice: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  BookingRemarks = BookingRemarks;
  CustomerName = '';

  companyRef = this.companystatemanagement.SelectedCompanyRef;
  headers: string[] = ['Sr.No.', 'Customer', 'Registration Person One', 'Registration Person Two', 'Plot Name', 'Bank', 'Witness', 'Agreement to Sale', 'Sale Deed', 'Talathi', '7/12	', 'Spiral', 'Client Submit	', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement, private screenSizeService: ScreenSizeService) {
    effect(() => {
      this.getSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
    if (this.Entity.p.SiteRef) {
      this.getPlotListBySiteRef();
    }
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

    if (this.SiteList.length > 0) {
      this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
      this.getPlotListBySiteRef();
      this.getRegistrarOfficeListBySiteAndPlotRef();
    }


    this.loadPaginationData();
  }


  // get PlotList With Site Ref //

  getPlotListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.PlotNoList = [];
    // this.Entity.p.PlotRef = 0;
    if (this.Entity.p.SiteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return
    }
    let lst = await Plot.FetchEntireListBySiteRef(this.Entity.p.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.PlotNoList = lst.filter(plot => plot.p.CurrentBookingRemark != BookingRemarks.Plot_Of_Owner && plot.p.CurrentBookingRemark != BookingRemarks.Plot_Of_Shree);
    this.loadPaginationData();
  }

  // get CustomerList By Site & Plot Ref //
  getRegistrarOfficeListBySiteAndPlotRef = async () => {
    this.DisplayMasterList = [];
    if (this.Entity.p.SiteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return
    }
    let lst = await RegistrarOffice.FetchEntireListBySiteAndPlotRef(this.Entity.p.SiteRef, this.Entity.p.PlotRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.CustomerList = lst.filter(
      (item, index, self) =>
        index === self.findIndex(t => t.p.CustomerName === item.p.CustomerName)
    );
    this.loadPaginationData();
  }

  getRegistrarOfficeListByCustomer = () => {
    this.DisplayMasterList = this.MasterList.filter((data) => data.p.CustomerName == this.CustomerName);
    this.loadPaginationData();
  }

  OnSiteChange = () => {
    this.Entity.p.PlotRef = 0;
  }

  isWitness1Completed(office: any): boolean {
    const p = office.p;
    return p.Witness1Name && p.Witness1ContactNo && p.Witness1IsAadharSubmit && p.Witness1IsPanSubmit;
  }

  isAgreementCompleted(office: any): boolean {
    const p = office.p;
    if (p.IsAgreementToSaleNo) {
      return true;
    }
    return p.AgreementDocumentNo && p.AgreementDate;
  }

  isSaleDeedCompleted(office: any): boolean {
    return office.p.SaleDeedDocumentNo && office.p.SaleDeedDate;
  }

  isFerfarCompleted(office: any): boolean {
    const p = office.p;
    return p.IsIndexOriginalSubmit &&
      p.IsDastZeroxSubmit &&
      p.TalathiDate &&
      p.IsFerfarNoticeSubmit;
  }

  onEditClicked = async (item: RegistrarOffice) => {
    this.SelectedRegistrarOffice = item.GetEditableVersion();
    RegistrarOffice.SetCurrentInstance(this.SelectedRegistrarOffice);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Registrar_Office_Details']);
    // this.router.navigate(['/homepage/Website/Registrar_Office_Details'], {
    //   state: { SiteRef: this.Entity.p.SiteRef }
    // });
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

  get paginatedList() {
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

  async AddRegistrarOffice() {
    this.router.navigate(['/homepage/Website/Registrar_Office_Details']);
  }
}
