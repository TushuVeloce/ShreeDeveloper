import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteVendorServiceCustomRequest } from 'src/app/classes/domain/entities/website/masters/vendorservices/DeleteVendorCustomRequest';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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

  headers: string[] = ['Sr.No.', 'Vendor Service', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService
  ) {
    effect(() => {
      this.FormulateVendorServiceList()
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  private FormulateVendorServiceList = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await VendorService.FetchEntireListByCompanyRef(this.companyRef(),
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
    await this.router.navigate(['/homepage/Website/Vendor_Services_Master_Details']);
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

  // DeleteVendorService = async (VendorService: VendorService) => {
  //   await this.uiUtils.showConfirmationMessage(
  //     'Delete', `This process is <strong>IRREVERSIBLE!</strong> <br/>Are you sure that you want to DELETE this Service?`,
  //     async () => {
  //       let req = new DeleteVendorServiceCustomRequest();
  //       req.VendorServiceRef = VendorService.p.Ref;
  //       let td = req.FormulateTransportData();
  //       let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
  //       let tr = await this.serverCommunicator.sendHttpRequest(pkt);
  //       if (!tr.Successful) {
  //         await this.uiUtils.showErrorMessage('Error', tr.Message);
  //         return;
  //       }
  //       await this.uiUtils.showSuccessToster(`Vendor Service ${VendorService.p.Name} has been deleted!`);
  //       let tdResult = JSON.parse(tr.Tag) as TransportData;
  //     }
  //   );
  //   this.FormulateVendorServiceList()
  //   this.loadPaginationData()
  //    this.SearchString = '';
  // };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
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
