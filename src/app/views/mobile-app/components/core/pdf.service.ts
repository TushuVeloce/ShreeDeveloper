import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PDFService {
  constructor(private platform: Platform) { }

  async generatePdfAndHandleAction(element: HTMLElement, fileName = 'Receipt.pdf') {
    if (this.platform.is('capacitor')) {
      // Mobile: Share PDF
      await this.generateAndSharePdf(element, fileName);
    } else {
      // Web: Print directly
      this.printHtml(element);
    }
  }

  private async generateAndSharePdf(element: HTMLElement, fileName: string) {
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const pdfBlob = pdf.output('blob');
      const base64 = await this.convertBlobToBase64(pdfBlob);

      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });

      const fileUriResult = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName,
      });

      await Share.share({
        title: 'Share Receipt PDF',
        text: 'Here is your receipt PDF.',
        url: fileUriResult.uri,
        dialogTitle: 'Share Receipt PDF',
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
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
            * {
              font-family: sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #aaa;
              padding: 10px;
              text-align: center;
            }
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
