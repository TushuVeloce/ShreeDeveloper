import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseTypeRefs, ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { ExpenseTypes } from 'src/app/classes/domain/domainenums/domainenums';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-actual-stage-print',
  standalone: false,
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.scss'],
})

export class InvoicePrintComponent implements OnInit {
  Entity: Invoice = Invoice.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle = 'Receipt';
  IsDropdownDisabled: boolean = false
  InitialEntity: Invoice = null as any;
  isPrintButtonClicked: boolean = false;
  MachinaryExpenseRef: number = ExpenseTypeRefs.MachinaryExpense
  LabourExpenseRef: number = ExpenseTypeRefs.LabourExpense
  OtherExpenseRef: number = ExpenseTypeRefs.OtherExpense
  DisplayTotalWorkingHrs: string = ''
  StockExpenseRef: number = ExpenseTypes.StockExpense

  materialheaders: string[] = ['Sr.No.', 'Material', 'Unit', 'Order Quantity', 'Rate', 'Discount Rate', 'Delivery Charges', 'Total Amount'];

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private companystatemanagement: CompanyStateManagement
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    // history.state.myData;

    this.Entity = history.state.printData;
    this.getTotalWorkedHours();
    this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.CreatedDate);
    this.InitialEntity = Object.assign(Invoice.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Invoice;
  }

  totalAmountInWords(number: number): string {
    return this.utils.convertNumberToWords(number);
  }


  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
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


  BackInvoice = () => {
    this.router.navigate(['/homepage/Website/Billing']);
  }
}
