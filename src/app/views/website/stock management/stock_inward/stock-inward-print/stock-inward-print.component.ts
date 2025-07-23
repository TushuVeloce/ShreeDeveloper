import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
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
  companyRef = this.companystatemanagement.SelectedCompanyRef;


  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private companystatemanagement: CompanyStateManagement,
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.getInwardSingleInstanceByInwardRef(history.state.inwardref);
    this.InitialEntity = Object.assign(StockInward.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as StockInward;
  }

  getInwardSingleInstanceByInwardRef = async (InwardRef: number) => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockInward.FetchInstance(InwardRef, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.Entity = lst;

    this.Entity.p.PurchaseOrderDate = this.dtu.ConvertStringDateToShortFormat(lst.p.PurchaseOrderDate);
    if (lst.p.InwardDate) {
      this.Entity.p.InwardDate = lst.p.InwardDate
    }
  }

  totalAmountInWords(number: number): string {
    return this.utils.convertNumberToWords(number);
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
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              border: 1px solid  rgb(169, 167, 167);
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
