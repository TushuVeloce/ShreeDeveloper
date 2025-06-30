import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Order } from 'src/app/classes/domain/entities/website/stock_management/stock_order/order';
import { OrderMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_order/OrderMaterial/ordermaterial';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-stock-order',
  templateUrl: './stock-order.component.html',
  styleUrls: ['./stock-order.component.scss'],
  standalone: false,
})
export class StockOrderComponent implements OnInit {
  Entity: Order = Order.CreateNewInstance();
  MasterList: Order[] = [];
  DisplayMasterList: Order[] = [];
  SearchString: string = '';
  SiteList: Site[] = [];
  SelectedOrder: Order = Order.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  MaterialPurchaseOrderStatus = MaterialRequisitionStatuses;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site', 'Date', 'Vendor', 'Material', 'Unit', 'Requisition Quantity', 'Ordered Quantity', 'Requisition Remaining Quantity', 'Discount Rate', 'Delivery Date', 'Total Amount', 'Grand Total', 'Status', 'Action'];
  headerswithoutsite: string[] = ['Sr.No.', 'Date', 'Vendor', 'Material', 'Unit', 'Requisition Quantity', 'Ordered Quantity', 'Requisition Remaining Quantity', 'Discount Rate', 'Delivery Date', 'Total Amount', 'Grand Total', 'Status', 'Action'];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private DateconversionService: DateconversionService,
  ) {
    effect(async () => {
      await this.getOrderListByCompanyRef(); await this.getSiteListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getSiteListByCompanyRef = async () => {
    this.Entity.p.SiteRef = 0
    this.Entity.p.SiteName = ''
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  private getOrderListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Order.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  getOrderListByCompanyRefAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.SiteRef <= 0) {
      this.getOrderListByCompanyRef();
      return;
    }
    let lst = await Order.FetchEntireListByCompanyRefAndSiteRef(this.companyRef(), this.Entity.p.SiteRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  };

  onEditClicked = async (item: Order) => {
    this.SelectedOrder = item.GetEditableVersion();
    Order.SetCurrentInstance(this.SelectedOrder);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Stock_Order_Details']);
  };

  onDeleteClicked = async (Order: Order) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
        Are you sure that you want to DELETE this Order?`,
      async () => {
        await Order.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Order of ${Order.p.VendorName} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          if (this.Entity.p.SiteRef <= 0) {
            this.getOrderListByCompanyRef();
          } else {
            this.getOrderListByCompanyRefAndSiteRef();
          }
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

  checkIsEnable = (data: OrderMaterialDetailProps[]): boolean => {
    // Collect boolean values based on the condition
    const booleanValues = data.map(item => item.RequisitionQty <= item.TotalOrderedQty);

    // If ANY entry fails (QuotationOrderedQty <= OrderedQty), return false
    const status = booleanValues.every(value => value);
    return status;
  };

  navigateToPrint = async (item: Order) => {
    this.router.navigate(['/homepage/Website/Stock_Order_Print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  AddOrder = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Stock_Order_Details']);
  }

  NavigateOrderstatus = (item: Order) => {
    this.SelectedOrder = item.GetEditableVersion();
    Order.SetCurrentInstance(this.SelectedOrder);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    this.router.navigate(['/homepage/Website/Order_Approval']);
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



