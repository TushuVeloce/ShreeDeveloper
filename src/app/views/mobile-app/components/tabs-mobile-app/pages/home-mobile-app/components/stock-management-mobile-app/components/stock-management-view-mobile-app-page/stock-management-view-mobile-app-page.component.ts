import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-stock-management-view-mobile-app-page',
  templateUrl: './stock-management-view-mobile-app-page.component.html',
  styleUrls: ['./stock-management-view-mobile-app-page.component.scss'],
  standalone:false
})
export class StockManagementViewMobileAppPageComponent  implements OnInit {


  constructor(private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private router: Router) { }

  ngOnInit() {
  }
  gridItems = [
    {
      icon: 'assets/icons/site_management_mobile_app.png',
      label: 'Material Requisition',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/material-requisition'
    },
    // {
    //   icon: 'assets/icons/stock_mobile_app.png',
    //   label: 'Quotation',
    //   routerPath: '/mobile-app/tabs/dashboard/stock-management/vendor-quotation'
    // },
    {
      icon: 'assets/icons/marketing_mobile_app.png',
      label: 'Stock Order',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-order'
    },
    {
      icon: 'assets/icons/crm_mobile_app.png',
      label: 'Stock Inward',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-inward'
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Stock Consume',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-consume'
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Stock Transfer',
      routerPath: '/mobile-app/tabs/dashboard/stock-management/stock-transfer'
    },
    // {
    //   icon: 'assets/icons/report_mobile_app.png',
    //   label: 'Report',
    //   routerPath: '/mobileapp/tabs/dashboard/stock-management/stock-consume'
    // },
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
