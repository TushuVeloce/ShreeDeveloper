import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-inward-print',
  standalone: false,
  templateUrl: './stock-inward-print.component.html',
  styleUrls: ['./stock-inward-print.component.scss'],
})
export class StockInwardPrintComponent implements OnInit {
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
    private DateconversionService: DateconversionService,
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.Entity = history.state.printData;
    console.log('this.Entity :', this.Entity);
    // this.Entity.p.InwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.InwardDate);
    this.InitialEntity = Object.assign(StockInward.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as StockInward;
    this.getCompanySingleRecord()
    this.getVendorSingleRecord()
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

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }


  printSection() {
    const printContent = this.PrintContainer.nativeElement.innerHTML;
    const popupWindow = window.open('', '_blank', 'width=600,height=600');

    if (!popupWindow) {
      this.isPrintButtonClicked = true;
      alert(
        'The popup window was blocked by the browser. Please allow pop-ups for this site and try again.'
      );
      return;
    }
    popupWindow.document.open();
    popupWindow.document.write(`
      <html>
        <head>
          <title>Recipt</title>
          <style>
         * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: sans-serif;
           }
            table {
              bStockInward-collapse: collapse;
              width: 100%;
            }

            th, td {
              bStockInward: 1px solid  rgb(169, 167, 167);
              text-align: center;
              padding: 15px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">${printContent}</body>
      </html>
    `);
    popupWindow.document.close();
    this.isPrintButtonClicked = false;
  }


  BackStockInward = () => {
    this.router.navigate(['/homepage/Website/Stock_Inward']);
  }
}
