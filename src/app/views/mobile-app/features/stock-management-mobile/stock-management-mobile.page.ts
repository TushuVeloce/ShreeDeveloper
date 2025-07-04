import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-management-mobile',
  templateUrl: './stock-management-mobile.page.html',
  styleUrls: ['./stock-management-mobile.page.scss'],
  standalone: false
})
export class StockManagementMobilePage implements OnInit {

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
      routerPath: '/mobileapp/tabs/dashboard/stock-management/material-requisition'
    },
    // {
    //   icon: 'assets/icons/stock_mobile_app.png',
    //   label: 'Quotation',
    //   routerPath: '/mobileapp/tabs/dashboard/stock-management/vendor-quotation'
    // },
    {
      icon: 'assets/icons/marketing_mobile_app.png',
      label: 'Stock Order',
      routerPath: '/mobileapp/tabs/dashboard/stock-management/stock-order'
    },
    {
      icon: 'assets/icons/crm_mobile_app.png',
      label: 'Stock Inward',
      routerPath: '/mobileapp/tabs/dashboard/stock-management/stock-inward'
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Stock Consume',
      routerPath: '/mobileapp/tabs/dashboard/stock-management/stock-consume'
    },
    {
      icon: 'assets/icons/report_mobile_app.png',
      label: 'Stock Transfer',
      routerPath: '/mobileapp/tabs/dashboard/stock-management/stock-transfer'
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
