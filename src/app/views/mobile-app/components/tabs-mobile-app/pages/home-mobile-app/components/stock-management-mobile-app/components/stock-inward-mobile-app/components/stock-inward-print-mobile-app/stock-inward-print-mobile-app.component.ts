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
  companyRef: number = 0;


  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement,
    private pdfService: PDFService,
    private DateconversionService: DateconversionService,
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
    this.companyRef = Number(company || 0);
    this.getInwardSingleInstanceByInwardRef(history.state.inwardref);
    // this.Entity = history.state.printData;
    console.log('this.Entityyyyyyyyyy :', this.Entity);
    // this.Entity.p.PurchaseOrderDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.PurchaseOrderDate);
    this.InitialEntity = Object.assign(StockInward.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as StockInward;
    // this.getCompanySingleRecord()
    // this.getVendorSingleRecord()
  }

  @ViewChild('PrintContainer') printContainer!: ElementRef;

  async handlePrintOrShare() {
    if (!this.printContainer) return;
    await this.pdfService.generatePdfAndHandleAction(this.printContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
  }


  //Get Print Data

  getInwardSingleInstanceByInwardRef = async (InwardRef: number) => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockInward.FetchInstance(InwardRef, this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
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

}
