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
  CustomerList: CustomerFollowUp[] = [];
  PlotNoList: Plot[] = [];
  SearchString: string = '';
  SelectedRegistrarOffice: RegistrarOffice = RegistrarOffice.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  BookingRemarks = BookingRemarks;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  headers: string[] = ['Sr.No.', 'Customer', 'Plot Name', 'Cheque', 'Witness', 'Agreement to Sale', 'Sale Deed', 'Talathi', '7/12	', 'Spiral', 'Client Submit	', 'Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private companystatemanagement: CompanyStateManagement, private screenSizeService: ScreenSizeService) {
    effect(() => {
      this.getSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.Entity.p.SiteRef = Number(this.appStateManage.StorageKey.getItem('registartsiteRef'));
    this.Entity.p.PlotRef = Number(this.appStateManage.StorageKey.getItem('registartplotRef'));
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
    }


    this.loadPaginationData();
  }


  // get PlotList With Site Ref //

  getPlotListBySiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.PlotNoList = [];
    // this.Entity.p.PlotRef = 0;
    this.appStateManage.StorageKey.setItem('registartsiteRef', String(this.Entity.p.SiteRef));
    if (this.Entity.p.SiteRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Site`);
      return
    }
    let lst = await Plot.FetchEntireListBySiteRef(this.Entity.p.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.PlotNoList = lst.filter(plot => plot.p.CurrentBookingRemark != BookingRemarks.Plot_Of_Owner && plot.p.CurrentBookingRemark != BookingRemarks.Plot_Of_Shree);
    this.getRegistrarOfficeListBySiteRef(this.Entity.p.SiteRef)
    this.loadPaginationData();
  }

  // get CustomerList With Plot Ref //
  getRegistrarOfficeListBySiteRef = async (SiteRef: number) => {
    this.DisplayMasterList = [];
    let lst = await RegistrarOffice.FetchEntireListBySiteRef(SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  // get CustomerList With Plot Ref //
  getRegistrarOfficeListByPlotRef = async (PlotRef: number) => {
    this.DisplayMasterList = [];
    if (PlotRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Plot`);
      return
    }
    this.appStateManage.StorageKey.setItem('registartplotRef', String(PlotRef));
    let lst = await RegistrarOffice.FetchEntireListByPlotRef(PlotRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  OnSiteChange = () => {
    this.Entity.p.PlotRef = 0;
    this.appStateManage.StorageKey.setItem('registartplotRef', String(this.Entity.p.PlotRef));
  }

  isWitness1Completed(office: any): boolean {
    const p = office.p;
    return p.Witness1Name && p.Witness1ContactNo && p.Witness1IsAadharSubmit && p.Witness1IsPanSubmit;
  }

  isAgreementCompleted(office: any): boolean {
    const p = office.p;
    if (!this.Entity.p.IsAgreementToSaleYes) {
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

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  async AddRegistrarOffice() {
    this.router.navigate(['/homepage/Website/Registrar_Office_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.CustomerName.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

}
