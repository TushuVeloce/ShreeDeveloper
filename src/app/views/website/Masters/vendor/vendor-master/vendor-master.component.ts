import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteVendorCustomRequest } from 'src/app/classes/domain/entities/website/masters/vendor/DeleteVendorCustomRequest';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-vendor-master',
  standalone: false,
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.scss'],
})
export class VendorMasterComponent implements OnInit {
  Entity: Vendor = Vendor.CreateNewInstance();
  MasterList: Vendor[] = [];
  DisplayMasterList: Vendor[] = [];
  SearchString: string = '';
  SelectedVendor: Vendor = Vendor.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['SR.No', 'Vendor Name', 'Mobile No', 'Address', 'Company Name', 'Action'];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private screenSizeService: ScreenSizeService
  ) {
    effect(() => {
      this.getVendorListByCompanyRef()
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getVendorListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Vendor) => {
    this.SelectedVendor = item.GetEditableVersion();
    Vendor.SetCurrentInstance(this.SelectedVendor);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Vendor_Master_Details']);
  }

  onDeleteClicked = async (Vendor: Vendor) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Vendor?`,
      async () => {
        await Vendor.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Vendor ${Vendor.p.Name} has been deleted!`);
          await this.getVendorListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
          // await this.FormulateMasterList();
        });
      });
  }

  // DeleteVendor = async (Vendor: Vendor) => {
  //       await this.uiUtils.showConfirmationMessage(
  //         'Delete', `This process is <strong>IRREVERSIBLE!</strong> <br/>Are you sure that you want to DELETE this Vendor?`,
  //         async () => {
  //           let req = new DeleteVendorCustomRequest();
  //           req.VendorRef = Vendor.p.Ref;
  //           let td = req.FormulateTransportData();
  //           let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
  //           let tr = await this.serverCommunicator.sendHttpRequest(pkt);
  //           if (!tr.Successful) {
  //             await this.uiUtils.showErrorMessage('Error', tr.Message);
  //             return;
  //           }
  //           await this.uiUtils.showSuccessToster(`Vendor ${Vendor.p.Name} has been deleted!`);
  //           let tdResult = JSON.parse(tr.Tag) as TransportData;
  //         }
  //       );
  //        this.SearchString = '';
  //       this.getVendorListByCompanyRef()
  //       this.loadPaginationData()
  //     };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  AddVendor = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Vendor_Master_Details']);
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
