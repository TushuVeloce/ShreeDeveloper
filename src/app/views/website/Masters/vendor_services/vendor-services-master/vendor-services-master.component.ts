import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-vendor-services-master',
  standalone: false,
  templateUrl: './vendor-services-master.component.html',
  styleUrls: ['./vendor-services-master.component.scss'],
})
export class VendorServicesMasterComponent  implements OnInit {
  Entity: VendorService = VendorService.CreateNewInstance();
  MasterList: VendorService[] = [];
  DisplayMasterList: VendorService[] = [];
  SearchString: string = '';
  SelectedVendorService: VendorService = VendorService.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  headers: string[] = ['Sr.No.', 'VendorService', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService ) {}

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.FormulateVendorServiceList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }
  private FormulateVendorServiceList = async () => {
    let lst = await VendorService.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    console.log(lst);
    this.MasterList = lst;
    console.log('MasterList :', this.MasterList);
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: VendorService) => {
    // let props = Object.assign(VendorServiceProps.Blank(),item.p);
    // this.SelectedVendorService = VendorService.CreateInstance(props,true);

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

  AddVendorService() {
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