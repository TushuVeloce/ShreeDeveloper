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

@Component({
  selector: 'app-stock-inward-print-preview-mobile',
  templateUrl: './stock-inward-print-preview-mobile.page.html',
  styleUrls: ['./stock-inward-print-preview-mobile.page.scss'],
  standalone: false
})
export class StockInwardPrintPreviewMobilePage implements OnInit {

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
    private companystatemanagement: CompanyStateManagement
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


  // async onShare() {
  //   try {
  //     const element = this.printContainer.nativeElement;

  //     // 1. Capture element as canvas
  //     const canvas = await html2canvas(element, { scale: 2 });

  //     // 2. Convert canvas to image
  //     const imgData = canvas.toDataURL('image/png');

  //     // 3. Create PDF with jsPDF
  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'px',
  //       format: [canvas.width, canvas.height],
  //     });

  //     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

  //     // 4. Get PDF as Blob
  //     const pdfBlob = pdf.output('blob');

  //     // 5. Convert blob to base64 (without prefix)
  //     const base64Data = await this.convertBlobToBase64(pdfBlob);

  //     // 6. Define file name
  //     const fileName = `Receipt_${new Date().getTime()}.pdf`;

  //     // 7. Save the file to device's Documents directory
  //     await Filesystem.writeFile({
  //       path: fileName,
  //       data: base64Data,
  //       directory: Directory.Documents,
  //       recursive: true,
  //     });

  //     // 8. Get the file URI for sharing
  //     const fileUriResult = await Filesystem.getUri({
  //       directory: Directory.Documents,
  //       path: fileName,
  //     });

  //     // 9. Share the actual PDF file via its file URI
  //     await Share.share({
  //       title: 'Share Receipt PDF',
  //       text: 'Here is your receipt PDF.',
  //       url: fileUriResult.uri,  // This points to the actual file on device storage
  //       dialogTitle: 'Share Receipt PDF',
  //     });
  //   } catch (error) {
  //     console.error('Error sharing PDF file:', error);
  //   }
  // }

  // // Helper to convert Blob to base64 string without prefix
  // private convertBlobToBase64(blob: Blob): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = reject;
  //     reader.onload = () => {
  //       const dataUrl = reader.result as string;
  //       const base64 = dataUrl.split(',')[1]; // remove "data:*/*;base64," prefix
  //       resolve(base64);
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // }

  async onShare() {
    try {
      const element = this.printContainer.nativeElement;

      // 1. Capture the container as canvas
      const canvas = await html2canvas(element, { scale: 2 });

      // 2. Convert canvas to image data URL
      const imgData = canvas.toDataURL('image/png');

      // 3. Create PDF from the image
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      // 4. Get PDF as blob
      const pdfBlob = pdf.output('blob');

      // 5. Convert blob to base64
      const base64 = await this.convertBlobToBase64(pdfBlob) as string;

      // 6. Save PDF file to device storage
      const fileName = `Receipt_${this.Entity.p.Ref}.pdf`;
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });

      // 7. Get native file URI for sharing
      const fileUriResult = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName,
      });

      // 8. Share the actual saved file
      await Share.share({
        title: 'Share Receipt PDF',
        text: 'Here is your receipt PDF.',
        url: fileUriResult.uri,  // Native file URI — this shares the actual file!
        dialogTitle: 'Share Receipt PDF'
      });

    } catch (error) {
      console.error('Error while sharing receipt PDF:', error);
    }
  }
  // Helper function to convert blob to base64 string
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1]; // remove prefix
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
  // async onShare() {
  //   try {
  //     const element = this.printContainer.nativeElement;

  //     // 1. Generate canvas from HTML element
  //     const canvas = await html2canvas(element, { scale: 2 });
  //     const imgData = canvas.toDataURL('image/png');

  //     // 2. Create PDF using jsPDF
  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'px',
  //       format: [canvas.width, canvas.height],
  //     });
  //     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

  //     // 3. Get PDF as blob
  //     const pdfBlob = pdf.output('blob');

  //     // 4. Save PDF as actual file on device using Capacitor Filesystem
  //     const base64 = await this.convertBlobToBase64(pdfBlob) as string;

  //     const fileName = `Receipt_${Date.now()}.pdf`;

  //     // Save to Documents
  //     const saved = await Filesystem.writeFile({
  //       path: fileName,
  //       data: base64,
  //       directory: Directory.Documents,
  //       recursive: true,
  //     });

  //     // 5. Get the native file URI
  //     const fileUri = await Filesystem.getUri({
  //       directory: Directory.Documents,
  //       path: fileName,
  //     });

  //     // 6. Convert URI to real path (only for Android using FileOpener or Share plugin)
  //     const finalUri = fileUri.uri;

  //     // 7. Share the actual file
  //     await Share.share({
  //       title: 'Share Receipt',
  //       text: 'Here is the actual receipt PDF file.',
  //       url: finalUri, // 👈 This must be a valid file URI like file:///.../Receipt_123.pdf
  //       dialogTitle: 'Share your receipt'
  //     });

  //   } catch (error) {
  //     console.error('Sharing failed:', error);
  //   }
  // }
  // private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onerror = reject;
  //   reader.onload = () => {
  //     const base64 = (reader.result as string).split(',')[1]; // remove "data:*/*;base64,"
  //     resolve(base64);
  //   };
  //   reader.readAsDataURL(blob);
  // });


}
