import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-stock-management-view-mobile-app-page',
  templateUrl: './stock-management-view-mobile-app-page.component.html',
  styleUrls: ['./stock-management-view-mobile-app-page.component.scss'],
  standalone: false,
})
export class StockManagementViewMobileAppPageComponent implements OnInit {
  constructor(
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private router: Router,
    public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit() {
    this.gridItems = this.gridItems.filter((item) =>
      this.access.hasAnyAccess(item.Ref)
    );
  }
  gridItems = [
    {
      icon: 'assets/icons/material_requisition_mobile_app.png',
      label: 'Material Requisition',
      routerPath:
        '/mobile-app/tabs/dashboard/stock-management/material-requisition',
      Ref: ApplicationFeatures.MaterialRequisition,
    },
    // {
    //   icon: 'assets/icons/stock_mobile_app.png',
    //   label: 'Quotation',
    //   routerPath: '/mobile-app/tabs/dashboard/stock-management/vendor-quotation'
    // },
    {
      icon: 'assets/icons/marketing_mobile_app.png',
      label: 'Stock Order',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-order',
      Ref: ApplicationFeatures.StockOrder,
    },
    {
      icon: 'assets/icons/stock_inward_mobile_app.png',
      label: 'Stock Inward',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-inward',
      Ref: ApplicationFeatures.StockInward,
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Stock Consume',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-consume',
      Ref: ApplicationFeatures.StockConsume,
    },
    {
      icon: 'assets/icons/stock_transfer_mobile_app.png',
      label: 'Stock Transfer',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-transfer',
      Ref: ApplicationFeatures.StockTransfer,
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Stock Summary',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-summary',
      Ref: ApplicationFeatures.StockSummary,
    },
  ];

  // selectedIndex = 0;

  // selectItem(index: number) {
  //   this.selectedIndex = index;
  // }

  selectedIndex = 0;
  expensePercent = 30; // Example static percentage

  // gridItems = [
  //   {
  //     icon: 'assets/icons/site_management_mobile_app.png',
  //     label: 'Food',
  //     routerPath: '/food'
  //   },
  //   {
  //     icon: 'assets/icons/stock_mobile_app.png',
  //     label: 'Transport',
  //     routerPath: '/transport'
  //   },
  //   {
  //     icon: 'assets/icons/marketing_mobile_app.png',
  //     label: 'Medicine',
  //     routerPath: '/medicine'
  //   },
  //   {
  //     icon: 'assets/icons/crm_mobile_app.png',
  //     label: 'Groceries',
  //     routerPath: '/groceries'
  //   },
  //   {
  //     icon: 'assets/icons/report_mobile_app.png',
  //     label: 'Rent',
  //     routerPath: '/rent'
  //   },
  //   {
  //     icon: 'assets/icons/report_mobile_app.png',
  //     label: 'Gifts',
  //     routerPath: '/gifts'
  //   },
  //   {
  //     icon: 'assets/icons/report_mobile_app.png',
  //     label: 'Savings',
  //     routerPath: '/savings'
  //   },
  //   {
  //     icon: 'assets/icons/report_mobile_app.png',
  //     label: 'Entertainment',
  //     routerPath: '/entertainment'
  //   },
  //   {
  //     icon: 'assets/icons/report_mobile_app.png',
  //     label: 'More',
  //     routerPath: '/more'
  //   },
  // ];

  selectItem(index: number) {
    this.selectedIndex = index;
  }
}
