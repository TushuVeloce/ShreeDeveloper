import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Quotation } from 'src/app/classes/domain/entities/website/stock_management/Quotation/quotation';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-quotation',
  standalone: false,
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit {
  Entity: Quotation = Quotation.CreateNewInstance();
  MasterList: Quotation[] = [];
  DisplayMasterList: Quotation[] = [];
  SearchString: string = '';
  SiteList: Site[] = [];
  SelectedQuotation: Quotation = Quotation.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site', 'Date', 'Vendor', 'Material', 'Unit', 'Required Quantity', 'Ordered Quantity', 'Discount Rate', 'Delivery Date', 'Net Amount', 'Total Amount', 'Status', 'Action'];
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.FormulateQuotationList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getActualStageListByAllFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    let Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date);
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Quotation.FetchEntireListBySiteRef(this.Entity.p.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  private FormulateQuotationList = async () => {
    let lst = await Quotation.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    console.log('lst :', lst);
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: Quotation) => {

    this.SelectedQuotation = item.GetEditableVersion();

    Quotation.SetCurrentInstance(this.SelectedQuotation);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Quotation_Details']);
  };

  onDeleteClicked = async (Quotation: Quotation) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Quotation?`,
      async () => {
        await Quotation.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Quotation of ${Quotation.p.VendorName} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          this.FormulateQuotationList();
        });
      });
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

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

  AddQuotation = () => {
    this.router.navigate(['/homepage/Website/Quotation_Master_Details']);
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

