import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Add this import for autoTable
import { Platform } from '@ionic/angular';
import { ToastService } from './toast.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class PDFService {
  constructor(
    private platform: Platform,
    private toast: ToastService,
    private loading: LoadingService
  ) { }

  /**
   * Main entry point to generate a PDF from an HTML element or a data set and handle the action (download or share).
   * @param element The HTMLElement to convert to PDF. Pass null if generating from data.
   * @param fileName The desired name for the output PDF file.
   * @param reportData An object containing headers and data for a tabular report.
   * @param useMultiPageHtml Flag to use the advanced multi-page HTML rendering.
   */
  async generatePdfAndHandleAction(
    element: HTMLElement | null,
    fileName = 'Receipt.pdf',
    reportData?: { headers: string[], data: any[][] },
    useMultiPageHtml = false,
    pageOfOrientation: 'p' | 'l' = 'p',
    totalColumnIndices?: number[],
    title?: string
  ): Promise<void> {

    // Show a loading indicator to the user
    await this.loading.show('Generating PDF...');

    let pdf: jsPDF | null = null;

    try {
      if (element && useMultiPageHtml) {
        // If an element is provided and multi-page is requested, generate from HTML with multi-page support
        pdf = await this.generateMultiPagePdfFromHtml(element, pageOfOrientation);
      } else if (element) {
        // Fallback to the original HTML-to-PDF method
        pdf = await this.generatePdfFromHtml(element, pageOfOrientation);
      } else if (reportData) {
        // If report data is provided, generate a tabular PDF
        pdf = this.generateReportPdf(reportData.headers, reportData.data, pageOfOrientation, totalColumnIndices, title);
      } else {
        // Handle the case where no valid input is provided
        // console.error('Error: No valid content or data provided for PDF generation.');
        await this.toast.present('Could not find the content to generate a PDF.', 3000, 'danger');
        return;
      }

      if (this.platform.is('capacitor')) {
        // If on a mobile device (iOS/Android), generate and share the PDF
        await this.sharePdf(pdf, fileName);
      } else {
        // If on the web, simply generate and download the PDF
        this.downloadPdf(pdf, fileName);
      }
    } catch (error) {
      // console.error('An error occurred during PDF generation:', error);
      await this.toast.present('Could not generate the PDF. Please try again.', 3000, 'danger');
    } finally {
      // Always hide the loading indicator
      await this.loading.hide();
    }
  }

  /**
   * Generates a single-page PDF from an HTML element. This method is best for simple, non-overflowing content.
   * It handles vertical overflow by creating new pages, but does not handle horizontal overflow.
   * @param element The HTMLElement to convert to PDF.
   * @returns A Promise that resolves with the generated jsPDF document.
   */
  private async generatePdfFromHtml(element: HTMLElement, pageOfOrientation: 'p' | 'l' = 'p'): Promise<jsPDF> {
    const NewElement = element.cloneNode(true) as HTMLElement;
    const originalDisplay = NewElement.style.display;
    NewElement.style.display = 'block';
    NewElement.style.width = '800px';

    try {
      const clonedElement = NewElement.cloneNode(true) as HTMLElement;

      const tableContainer = clonedElement.querySelector('div[style*="overflow-x:auto"]');
      if (tableContainer instanceof HTMLElement) {
        tableContainer.style.overflowX = 'hidden';
      }

      const imgs = clonedElement.querySelectorAll('img');
      imgs.forEach(img => {
        if (img.src && img.src.startsWith('assets/')) {
          const absoluteUrl = new URL(img.src, window.location.origin).href;
          img.src = absoluteUrl;
        }
      });

      document.body.appendChild(clonedElement);
      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(clonedElement, { scale: 2 });
      document.body.removeChild(clonedElement);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF(pageOfOrientation, 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      return pdf;
    } finally {
      NewElement.style.display = originalDisplay;
      NewElement.style.width = '800px';
    }
  }

  /**
   * Generates a multi-page PDF with both vertical and horizontal page breaks, like Excel.
   * This is ideal for large, complex HTML tables or dashboards.
   * @param element The HTMLElement to convert to PDF.
   * @returns A Promise that resolves with the generated jsPDF document.
   */
  private async generateMultiPagePdfFromHtml(element: HTMLElement, pageOfOrientation: 'p' | 'l' = 'p'): Promise<jsPDF> {
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    try {
      const clonedElement = element.cloneNode(true) as HTMLElement;

      const tableContainer = clonedElement.querySelector('div[style*="overflow-x:auto"]');
      if (tableContainer instanceof HTMLElement) {
        tableContainer.style.overflowX = 'hidden';
      }

      const imgs = clonedElement.querySelectorAll('img');
      imgs.forEach(img => {
        if (img.src && img.src.startsWith('assets/')) {
          const absoluteUrl = new URL(img.src, window.location.origin).href;
          img.src = absoluteUrl;
        }
      });

      // Temporarily append the cloned element to the document to measure its size
      document.body.appendChild(clonedElement);
      await new Promise(resolve => setTimeout(resolve, 50));

      const elementWidth = clonedElement.offsetWidth;
      const elementHeight = clonedElement.offsetHeight;
      document.body.removeChild(clonedElement);

      const a4Width = 210; // A4 width in mm
      const a4Height = 297; // A4 height in mm
      const a4PixelWidth = 794; // A4 width in pixels at 96 dpi

      const scale = a4PixelWidth / elementWidth;
      const scaledHeight = elementHeight * scale;
      const pagesVertically = Math.ceil(scaledHeight / a4Height);
      const pagesHorizontally = Math.ceil(elementWidth / a4PixelWidth);

      const pdf = new jsPDF(pageOfOrientation, 'mm', 'a4');
      let firstPage = true;

      for (let x = 0; x < pagesHorizontally; x++) {
        for (let y = 0; y < pagesVertically; y++) {
          if (!firstPage) {
            pdf.addPage();
          }

          const canvas = await html2canvas(element, {
            scale: 2,
            logging: true,
            x: x * a4PixelWidth,
            y: y * (a4Height / scale),
            width: a4PixelWidth,
            height: a4Height / scale,
          });

          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height);
          firstPage = false;
        }
      }
      return pdf;
    } finally {
      element.style.display = originalDisplay;
    }
  }

  /**
   * Generates a tabular PDF from an array of headers and data using jspdf-autotable.
   * @param headers The table headers.
   * @param data The table data.
   * @returns The generated jsPDF document.
   */
  private generateReportPdf(headers: string[], data: any[][], pageOfOrientation: 'p' | 'l' = 'p', totalColumnIndices?: number[], title?: string): jsPDF {
    const doc = new jsPDF(pageOfOrientation);
    // Add title if provided
    if (title) {
      doc.setFontSize(16);
      doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    }

    // Determine the columns to sum, defaulting to the last column if none are specified
    const colsToSum = totalColumnIndices && totalColumnIndices.length > 0 ? totalColumnIndices : [headers.length - 1];

    // Calculate the grand total for each specified column
    const totals = colsToSum.map(index => {
      return data.reduce((sum, row) => {
        const value = row[index] as number;
        // Ensure the value is a number before adding
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
    });

    // Create the grand total row
    const totalRow = new Array(headers.length).fill(' ');
    // Place the totals in their respective columns
    colsToSum.forEach((colIndex, i) => {
      totalRow[colIndex] = `Total: ${totals[i]}`;
    });

    autoTable(doc, {
      head: [headers],
      body: data,
      headStyles: {
        fillColor: '#832828',
        textColor: '#ffffff',
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1, // Add border to all cells
        lineColor: '#000000',
      },
      // bodyStyles: {
      //   fillColor: '#ecf0f1',
      //   textColor: '#34495e',
      // },
      alternateRowStyles: {
        fillColor: '#ffffff'
      },
      footStyles: {
        fillColor: '#ffffff',
        textColor: '#000',
        fontStyle: 'bold',
        halign: 'center'
      },
      foot: [totalRow],
      showHead: 'everyPage',
      showFoot: 'lastPage', 
    });
    return doc;
  }

  /**
   * Saves and shares the generated PDF on a mobile device.
   * @param pdf The jsPDF document.
   * @param fileName The desired name for the output PDF file.
   */
  private async sharePdf(pdf: jsPDF, fileName: string): Promise<void> {
    try {
      const perms = await Filesystem.checkPermissions();
      if (perms.publicStorage !== 'granted') {
        await Filesystem.requestPermissions();
      }

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
        title: 'Share PDF',
        text: 'Here is your PDF document.',
        url: fileUriResult.uri,
        dialogTitle: 'Share PDF',
      });

      await this.toast.present('PDF generated and ready to share!', 3000, 'success');
    } catch (error) {
      // console.error('Error sharing PDF:', error);
      throw error;
    }
  }

  /**
   * Triggers a browser download for the generated PDF on web platforms.
   * @param pdf The jsPDF document.
   * @param fileName The desired name for the output PDF file.
   */
  private downloadPdf(pdf: jsPDF, fileName: string): void {
    try {
      pdf.save(fileName);
      this.toast.present('PDF downloaded successfully!', 3000, 'success');
    } catch (error) {
      // console.error('Error downloading PDF:', error);
      throw error;
    }
  }

  /**
   * Converts a Blob object to a Base64 string.
   * @param blob The Blob to convert.
   * @returns A promise that resolves with the Base64 string.
   */
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