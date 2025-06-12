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
  stockOptions = [
    { label: 'Material Requisition', route: 'material-requisition', icon: 'document-text-outline' },
    { label: 'Quotation', route: 'vendor-quotation', icon: 'pricetag-outline' },
    { label: 'Stock Order', route: 'stock-order', icon: 'clipboard-outline' },
    { label: 'Stock Inward', route: 'stock-inward', icon: 'download-outline' },
    { label: 'Stock Transfer', route: 'stock-transfer', icon: 'swap-horizontal-outline' },
    { label: 'Stock Consume', route: 'stock-consume', icon: 'swap-horizontal-outline' }
  ];

  async navigateTo(route: string) {
    await this.haptic.mediumImpact();
    this.router.navigate([`mobileapp/tabs/stock/${route}`]);
  }
}
