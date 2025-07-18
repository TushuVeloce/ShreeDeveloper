import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';

@Component({
  selector: 'app-stock-inward-print-mobile-app',
  templateUrl: './stock-inward-print-mobile-app.component.html',
  styleUrls: ['./stock-inward-print-mobile-app.component.scss'],
  standalone: false
})
export class StockInwardPrintMobileAppComponent implements OnInit {

  Entity: StockInward = StockInward.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle = 'Receipt';
  IsDropdownDisabled: boolean = false
  InitialEntity: StockInward = null as any;
  isPrintButtonClicked: boolean = false;
  CompanyEntity: Company = Company.CreateNewInstance();
  VendorEntity: Vendor = Vendor.CreateNewInstance();

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement,
    private pdfService: PDFService
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.Entity = history.state.printData;
    console.log('this.Entityyyyyyyyyy :', this.Entity);
    this.Entity.p.PurchaseOrderDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.PurchaseOrderDate);
    this.InitialEntity = Object.assign(StockInward.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as StockInward;
    this.getCompanySingleRecord()
    this.getVendorSingleRecord()
  }

  @ViewChild('PrintContainer') printContainer!: ElementRef;

  async handlePrintOrShare() {
    if (!this.printContainer) return;
    await this.pdfService.generatePdfAndHandleAction(this.printContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
  }

  getCompanySingleRecord = async () => {
    this.CompanyEntity = Company.CreateNewInstance();
    if (this.Entity.p.CompanyRef > 0) {
      let CompanyData = await Company.FetchInstance(this.Entity.p.CompanyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.CompanyEntity = CompanyData;
    }
  }

  totalAmountInWords(number: number): string {
    return this.utils.convertNumberToWords(number);
  }

  getVendorSingleRecord = async () => {
    this.VendorEntity = Vendor.CreateNewInstance();
    if (this.Entity.p.VendorRef > 0 && this.Entity.p.CompanyRef > 0) {
      let CompanyData = await Vendor.FetchInstance(this.Entity.p.VendorRef, this.Entity.p.CompanyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.VendorEntity = CompanyData;
    }
  }

}
