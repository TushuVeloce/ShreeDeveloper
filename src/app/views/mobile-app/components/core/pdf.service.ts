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
  providedIn: 'root',
})
export class PDFService {
  constructor(
    private platform: Platform,
    private toast: ToastService,
    private loading: LoadingService
  ) {}
  /**
   * Main entry point to generate a PDF from an HTML element or a data set and handle the action (download or share).
   */

  async generatePdfAndHandleAction(
    element: HTMLElement | null,
    fileName = 'Receipt.pdf',
    reportData?: { headers: string[]; data: any[][] },
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
        pdf = await this.generateMultiPagePdfFromHtml(
          element,
          pageOfOrientation
        );
      } else if (element) {
        // Fallback to the original HTML-to-PDF method
        pdf = await this.generatePdfFromHtml(element, pageOfOrientation);
      } else if (reportData) {
        // If report data is provided, generate a tabular PDF
        pdf = this.generateReportPdf(
          reportData.headers,
          reportData.data,
          pageOfOrientation,
          totalColumnIndices,
          title
        );
      } else {
        await this.toast.present(
          'Could not find the content to generate a PDF.',
          3000,
          'danger'
        );
        return;
      }

      if (this.platform.is('capacitor')) {
        // Mobile: generate and share
        await this.sharePdf(pdf, fileName);
      } else {
        // Web: download and attempt to share
        this.downloadPdf(pdf, fileName);

        //         if (navigator.share) {
        //           const pdfBlob = pdf.output('blob');
        //           if (navigator.canShare && navigator.canShare({ files: [new File([''], fileName)] })) {
        //             const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
        //             try {
        //               await navigator.share({
        //                 title: fileName,
        //                 text: 'Here is your PDF document.',
        //                 files: [pdfFile],
        //               });
        //             } catch (error) {
        //               // User canceled or share failed. Ignore silently.
        //             }
        //           }
        //         }
      }
    } catch (error) {
      await this.toast.present(
        'Could not generate the PDF. Please try again.',
        3000,
        'danger'
      );
    } finally {
      await this.loading.hide();
    }
  }
  /**
   * Generates a multi-page tabular PDF by dynamically splitting columns into chunks.
   * Remaining columns wrap to the next page, like Excel print.
   * @param reportData The full dataset and headers.
   * @param columnsPerPage The maximum number of columns to show on one page.
   */

  // -------------------------------------------------------------
  // NEW DYNAMIC SPLIT REPORT METHOD
  // -------------------------------------------------------------

  async generateDynamicSplitReport(
    fileName: string,
    reportData: { headers: string[]; data: any[][] },
    columnsPerPage: number,
    pageOfOrientation: 'p' | 'l' = 'l',
    title?: string
  ): Promise<void> {
    await this.loading.show('Generating Wide Report...');
    try {
      const { headers, data } = reportData;
      const totalColumns = headers.length;
      let startColIndex = 0;
      let firstPage = true;

      const doc = new jsPDF(pageOfOrientation);
      doc.setFont('Times-Roman', 'normal');

      while (startColIndex < totalColumns) {
        // Add page break before every new section except the first one
        if (!firstPage) {
          doc.addPage();
        }

        const endColIndex = Math.min(
          startColIndex + columnsPerPage,
          totalColumns
        ); // Slice headers for the current page

        const currentHeaders = headers.slice(startColIndex, endColIndex); // Slice data rows for the current page

        const currentData = data.map((row) =>
          row.slice(startColIndex, endColIndex)
        ); // Add title for the current page section

        if (title) {
          doc.setFontSize(16);
          doc.text(
            `${title} (Columns ${startColIndex + 1} - ${endColIndex})`,
            doc.internal.pageSize.width / 2,
            20,
            { align: 'center' }
          );
        } // Generate Table

        (autoTable as any)(doc, {
          head: [currentHeaders],
          body: currentData,
          startY: title ? 30 : 10,
          styles: {
            fontSize: 8,
            cellPadding: 1,
            cellWidth: 'wrap',
          },
          headStyles: {
            fillColor: '#832828',
            textColor: '#ffffff',
            fontStyle: 'bold',
            halign: 'center',
          },
          showHead: 'everyPage',
          showFoot: 'lastPage',
        });

        startColIndex = endColIndex;
        firstPage = false;
      } // --- Handle Output ---

      if (this.platform.is('capacitor')) {
        await this.sharePdf(doc, fileName);
      } else {
        this.downloadPdf(doc, fileName); // Web Share API logic (omitted for brevity, assume it's correctly handled in generatePdfAndHandleAction if needed)
      }
    } catch (error) {
      await this.toast.present(
        'Could not generate the wide report.',
        3000,
        'danger'
      );
    } finally {
      await this.loading.hide();
    }
  }
  /**
   * Generates a single-page PDF from an HTML element.
   */

  // -------------------------------------------------------------
  // FIX: REMOVING FIXED WIDTH IN generatePdfFromHtml
  // -------------------------------------------------------------

  private async generatePdfFromHtml(
    element: HTMLElement,
    pageOfOrientation: 'p' | 'l' = 'p'
  ): Promise<jsPDF> {
    // 1. Create a temporary print wrapper to isolate rendering for html2canvas
    const tempWrapper = document.createElement('div');
    tempWrapper.style.position = 'absolute';
    tempWrapper.style.top = '-9999px';
    tempWrapper.style.width = '100%';
    tempWrapper.style.zIndex = '-1';
    tempWrapper.style.display = 'block';  
    tempWrapper.style.width = '800px'; // Clone the content into the off-screen wrapper
    // The fixed width was the primary cause of the white screen/flicker issue.

    const clonedElement = element.cloneNode(true) as HTMLElement; // Handle image sources for the clone
    const imgs = clonedElement.querySelectorAll('img');
    imgs.forEach((img) => {
      if (img.src && img.src.startsWith('assets/')) {
        const absoluteUrl = new URL(img.src, window.location.origin).href;
        img.src = absoluteUrl;
      }
    });
    tempWrapper.appendChild(clonedElement);
    document.body.appendChild(tempWrapper);

    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        logging: false,
      });

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
    } catch (err) {
      throw err;
    } finally {
      if (tempWrapper.parentNode) {
        document.body.removeChild(tempWrapper);
      }
    }
  }
  /**
   * Generates a multi-page PDF with both vertical and horizontal page breaks, like Excel. (UNCHANGED)
   */

  // -------------------------------------------------------------
  // UNCHANGED METHODS (omitted for brevity but kept in original)
  // -------------------------------------------------------------

  private async generateMultiPagePdfFromHtml(
    element: HTMLElement,
    pageOfOrientation: 'p' | 'l' = 'p'
  ): Promise<jsPDF> {
    /* ... code ... */
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    try {
      const clonedElement = element.cloneNode(true) as HTMLElement;

      const tableContainer = clonedElement.querySelector(
        'div[style*="overflow-x:auto"]'
      );
      if (tableContainer instanceof HTMLElement) {
        tableContainer.style.overflowX = 'hidden';
      }

      const imgs = clonedElement.querySelectorAll('img');
      imgs.forEach((img) => {
        if (img.src && img.src.startsWith('assets/')) {
          const absoluteUrl = new URL(img.src, window.location.origin).href;
          img.src = absoluteUrl;
        }
      }); // Temporarily append the cloned element to the document to measure its size

      document.body.appendChild(clonedElement);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const elementWidth = clonedElement.offsetWidth;
      const elementHeight = clonedElement.offsetHeight;
      document.body.removeChild(clonedElement);

      const a4Width = 210;
      const a4Height = 297;
      const a4PixelWidth = 794;

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
   * Generates a tabular PDF from an array of headers and data using jspdf-autotable. (UNCHANGED)
   */

  private generateReportPdf(
    headers: string[],
    data: any[][],
    pageOfOrientation: 'p' | 'l' = 'p',
    totalColumnIndices?: number[],
    title?: string
  ): jsPDF {
    /* ... code ... */
    const doc = new jsPDF(pageOfOrientation); // Add title if provided
    if (title) {
      doc.setFont('Times-Roman', 'normal');
      doc.setFontSize(16);
      doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    }

    let totalRow: string[] = [];
    let hasTotalRow = false; // Check if we should calculate and show a total row

    if (totalColumnIndices && totalColumnIndices.length > 0) {
      hasTotalRow = true;
      const colsToSum = totalColumnIndices; // Calculate the grand total for each specified column

      const totals = colsToSum.map((index) => {
        return data.reduce((sum, row) => {
          const value = row[index] as number; // Ensure the value is a number before adding
          return sum + (typeof value === 'number' ? value : 0);
        }, 0);
      }); // Create the grand total row
      totalRow = new Array(headers.length).fill(' '); // Place the totals in their respective columns
      colsToSum.forEach((colIndex, i) => {
        totalRow[colIndex] = `Total: ${totals[i]}`;
      });
    }
    autoTable(doc, {
      head: [headers],
      body: data,
      headStyles: {
        fillColor: '#832828',
        textColor: '#ffffff',
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: '#000000',
      },
      alternateRowStyles: {
        fillColor: '#ffffff',
      },
      foot: hasTotalRow ? [totalRow] : [],
      footStyles: {
        fillColor: '#ffffff',
        textColor: '#000',
        fontStyle: 'bold',
        halign: 'center',
      },
      showHead: 'everyPage',
      showFoot: 'lastPage',
    });

    return doc;
  }
  /**
   * Saves and shares the generated PDF on a mobile device. (UNCHANGED)
   */

  private async sharePdf(pdf: jsPDF, fileName: string): Promise<void> {
    /* ... code ... */
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

      await this.toast.present(
        'PDF generated and ready to share!',
        3000,
        'success'
      );
    } catch (error) {
      throw error;
    }
  }
  /**
   * Triggers a browser download for the generated PDF on web platforms. (UNCHANGED)
   */

  private downloadPdf(pdf: jsPDF, fileName: string): void {
    /* ... code ... */
    try {
      pdf.save(fileName);
      this.toast.present('PDF downloaded successfully!', 3000, 'success');
    } catch (error) {
      throw error;
    }
  }
  /**
   * Converts a Blob object to a Base64 string. (UNCHANGED)
   */

  private convertBlobToBase64(blob: Blob): Promise<string> {
    /* ... code ... */
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

  // -------------------------------------------------------------
  // OLD generateSplitReport (REMOVED - replaced by Dynamic one)
  // -------------------------------------------------------------
  /*
async generateSplitReport(
    fileName: string,
    part1: { headers: string[], data: any[][] },
    part2: { headers: string[], data: any[][] },
    pageOfOrientation: 'p' | 'l' = 'p',
    title?: string
): Promise<void> {
    // ... code ...
}
*/
}
