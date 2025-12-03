import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { FeatureAccessService } from 'src/app/services/feature-access.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-vendor-services-master',
  standalone: false,
  templateUrl: './vendor-services-master.component.html',
  styleUrls: ['./vendor-services-master.component.scss'],
})
export class VendorServicesMasterComponent implements OnInit {
  Entity: VendorService = VendorService.CreateNewInstance();
  MasterList: VendorService[] = [];
  DisplayMasterList: VendorService[] = [];
  SearchString: string = '';
  SelectedVendorService: VendorService = VendorService.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  // headers: string[] = ['Sr.No.', 'Vendor Service', 'Action'];
  headers: string[] = [];
  featureRef: ApplicationFeatures = ApplicationFeatures.VendorServicesMaster;
  showActionColumn = false;
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    public access: FeatureAccessService
  ) {
    effect(() => {
      this.FormulateVendorServiceList();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    this.access.refresh();
    this.showActionColumn =
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    this.headers = [
      'Sr.No.',
      'Vendor Service',
      ...(this.showActionColumn ? ['Action'] : []),
    ];
  }

  private FormulateVendorServiceList = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await VendorService.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: VendorService) => {
    this.SelectedVendorService = item.GetEditableVersion();
    VendorService.SetCurrentInstance(this.SelectedVendorService);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate([
      '/homepage/Website/Vendor_Services_Master_Details',
    ]);
  };

  onDeleteClicked = async (Item: VendorService) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Vendor Service?`,
      async () => {
        await Item.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Vendor Service ${Item.p.Name} has been deleted!`
          );
          await this.FormulateVendorServiceList();
          this.SearchString = '';
          this.loadPaginationData();
          await this.FormulateVendorServiceList();
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

  AddVendorService = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Vendor_Services_Master_Details']);
  };
}
