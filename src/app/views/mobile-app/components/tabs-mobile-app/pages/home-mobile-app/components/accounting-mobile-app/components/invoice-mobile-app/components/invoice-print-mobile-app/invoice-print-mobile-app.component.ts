import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseTypeRefs } from 'src/app/classes/domain/constants';
import { ExpenseTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { PDFService } from 'src/app/views/mobile-app/components/core/pdf.service';

@Component({
  selector: 'app-invoice-print-mobile-app',
  templateUrl: './invoice-print-mobile-app.component.html',
  styleUrls: ['./invoice-print-mobile-app.component.scss'],
  standalone: false
})
export class InvoicePrintMobileAppComponent implements OnInit {

  Entity: Invoice = Invoice.CreateNewInstance();
  isDataLoaded: boolean = false; // New flag to ensure data is loaded
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle = 'Receipt';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Invoice = null as any;
  isPrintButtonClicked: boolean = false;
  MachinaryExpenseRef: number = ExpenseTypeRefs.MachinaryExpense;
  LabourExpenseRef: number = ExpenseTypeRefs.LabourExpense;
  OtherExpenseRef: number = ExpenseTypeRefs.OtherExpense;
  DisplayTotalWorkingHrs: string = '';
  StockExpenseRef: number = ExpenseTypes.StockExpense;

  materialheaders: string[] = ['Sr.No.', 'Material', 'Unit', 'Order Quantity', 'Rate', 'Discount Rate', 'Delivery Charges', 'Total Amount'];

  @ViewChild('PrintContainer') printContainer!: ElementRef;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private pdfService: PDFService
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.Entity = history.state.printData;
    console.log('this.Entity :', this.Entity);
    this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.CreatedDate);
    this.getTotalWorkedHours();
    this.InitialEntity = Object.assign(Invoice.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Invoice;

    // Set the flag to true after all data and calculations are complete
    this.isDataLoaded = true;
  }

  totalAmountInWords(number: number): string {
    return this.utils.convertNumberToWords(number);
  }

  getTotalWorkedHours(): number {
    let totalMinutes = this.Entity.p.MachineUsageDetailsArray.reduce((sum: number, item: any) => {
      return sum + parseFloat(item.WorkedHours || 0);
    }, 0);

    // Set display value in HH:mm format
    this.DisplayTotalWorkingHrs = this.formatMinutesToHourMin(totalMinutes);

    // Return hours as decimal (rounded to 2 decimals)
    let totalHours = totalMinutes / 60;
    return Math.round(totalHours * 100) / 100;
  }

  formatMinutesToHourMin = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}h ${formattedMinutes}m`;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  async handlePrintOrShare() {
    // We no longer need the setTimeout, as the *ngIf in the template
    // ensures the element is ready before the button is even clickable
    if (!this.printContainer) {
      console.error("Print container element not found.");
      return;
    }
    await this.pdfService.generatePdfAndHandleAction(this.printContainer.nativeElement, `Receipt_${this.Entity.p.Ref}.pdf`);
  }
}