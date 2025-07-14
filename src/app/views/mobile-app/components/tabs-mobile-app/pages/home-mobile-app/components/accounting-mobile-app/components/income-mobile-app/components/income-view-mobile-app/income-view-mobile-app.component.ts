import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Income } from 'src/app/classes/domain/entities/website/accounting/income/income';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-income-view-mobile-app',
  templateUrl: './income-view-mobile-app.component.html',
  styleUrls: ['./income-view-mobile-app.component.scss'],
  standalone:false
})
export class IncomeViewMobileAppComponent  implements OnInit {

  Entity: Income = Income.CreateNewInstance();
  MasterList: Income[] = [];
  DisplayMasterList: Income[] = [];
  SearchString: string = '';
  SelectedIncome: Income = Income.CreateNewInstance();
  CustomerRef: number = 0;

  companyRef = 0;
  modalOpen = false;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
    private utils: Utils,
  ) { }

  ngOnInit = async () => {
    await this.loadIncomeIfEmployeeExists();
  };

  @ViewChild('PrintContainer')
  PrintContainer!: ElementRef;

  ionViewWillEnter = async () => {
    await this.loadIncomeIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadIncomeIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadIncomeIfEmployeeExists() {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      await this.getIncomeListByCompanyRef();
    } catch (error) {
      console.error('Error in loadIncomeIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getIncomeListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Income.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: Income) => {
    this.SelectedIncome = item.GetEditableVersion();
    Income.SetCurrentInstance(this.SelectedIncome);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income/edit']);
  };

  async onDeleteClicked(item: Income) {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Income?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Deletion cancelled.');
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Income ${item.p.SubLedgerRef} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getIncomeListByCompanyRef();
              } catch (err) {
                console.error('Error deleting Income:', err);
                await this.toastService.present('Failed to delete Income', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error showing delete confirmation:', error);
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }

  printIncome() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=600');
    popupWin?.document.open();
    popupWin?.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .info-row-of-model { margin-bottom: 10px; }
          .label { font-weight: bold; display: inline-block; width: 180px; }
          .value { display: inline-block; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${printContents}
      </body>
    </html>
  `);
    popupWin?.document.close();
  }


  async onShare() {
    try {
      const element = this.PrintContainer.nativeElement;

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

  AddIncome = () => {
    if (this.companyRef <= 0) {
      //  this.uiUtils.showWarningToster('Please select company');
      this.toastService.present('Please select company', 1000, 'warning');
      this.haptic.warning();
      return;
    }
    this.router.navigate(['/mobile-app/tabs/dashboard/accounting/income/add']);
  }

  openModal(Income: any) {
    // console.log('Income: any, IncomeItem: any :', Income, IncomeItem);
    this.SelectedIncome = Income;
    // this.SelectedIncome = IncomeItem;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedIncome = Income.CreateNewInstance();
  }
}
