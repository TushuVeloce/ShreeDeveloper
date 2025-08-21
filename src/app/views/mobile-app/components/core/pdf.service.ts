import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Platform } from '@ionic/angular';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PDFService {
  constructor(private platform: Platform,private toast:ToastService) { }

  async generatePdfAndHandleAction(element: HTMLElement, fileName = 'Receipt.pdf') {
    if (this.platform.is('capacitor')) {
      await this.generateAndSharePdf(element, fileName);
    } else {
      this.printHtml(element);
    }
  }

  private async generateAndSharePdf(element: HTMLElement, fileName: string) {
    try {
      // Check + request permissions (Android only)
      const perms = await Filesystem.checkPermissions();
      if (perms.publicStorage !== 'granted') {
        await Filesystem.requestPermissions();
      }

      // Render to Canvas
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      // Convert to Base64
      const pdfBlob = pdf.output('blob');
      const base64 = await this.convertBlobToBase64(pdfBlob);

      // Save file
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });

      // Get file URI
      const fileUriResult = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName,
      });

      // Share
      await Share.share({
        title: 'Share Receipt PDF',
        text: 'Here is your receipt PDF.',
        url: fileUriResult.uri,
        dialogTitle: 'Share Receipt PDF',
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      await this.toast.present('Error sharing PDF' + error,1000,'danger')
    }
  }

  private printHtml(element: HTMLElement) {
    const content = element.innerHTML;
    const popupWindow = window.open('', '_blank', 'width=600,height=600');
    if (!popupWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this site.');
      return;
    }

    popupWindow.document.open();
    popupWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            * { font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #aaa; padding: 10px; text-align: center; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    popupWindow.document.close();
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }
}
