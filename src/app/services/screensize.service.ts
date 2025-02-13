// screen-size.service.ts
import { Injectable, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  pageSize = 10;

  constructor() {
    // this.setPageSize(); // Set initial page size
  }

  // @HostListener('window:resize')
  // onResize() {
  //   this.setPageSize(); // Update page size on resize
  // }

  // setPageSize() {
  //   const height = window.innerHeight;
  //   if (height >= 1200) {
  //     this.pageSize = 15;
  //   }else if (height >= 900) {
  //     this.pageSize = 14;
  //   }else if (height >= 850) {
  //     this.pageSize = 13;
  //   }else if (height >= 800) {
  //     this.pageSize = 12;
  //   }else if (height >= 750) {
  //     this.pageSize = 11;
  //   }else if (height >= 700) {
  //     this.pageSize = 10;
  //   }else if (height >= 650) {
  //     this.pageSize = 9;
  //   } else if (height >= 600) {
  //     this.pageSize = 8;
  //   }else {
  //     this.pageSize = 7;
  //   }
  // }

  // getPageSize(sizeDependOn:string): number {
  //   // return this.pageSize(sizeDependOn);
  //   const height = window.innerHeight;
  //   if (height >= 1200) {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 15: 13;
  //     return this.pageSize;
  //   }else if (height >= 900) {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 14: 12;
  //     return this.pageSize;
  //   }else if (height >= 850) {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 13: 11;
  //     return this.pageSize;
  //   }else if (height >= 800) {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 12: 10;
  //     return this.pageSize;
  //   }else if (height >= 750) {
  //          this.pageSize = sizeDependOn == 'withoutDropdown' ? 11: 9;
  //     return this.pageSize;
  //   }else if (height >= 700) {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 10: 8;
  //     return this.pageSize;
  //   }else if (height >= 650) {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 9: 7;
  //     return this.pageSize;
  //   } else if (height >= 600) {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 8: 6;
  //     return this.pageSize;
  //   }else {
  //     this.pageSize = sizeDependOn == 'withoutDropdown' ? 7: 5;
  //     return this.pageSize;
  //   }
  // }

  getPageSize(sizeDependOn: string, dropdownRows: number = 1): number {
    const height = window.innerHeight;
  
    // Constants for dynamic calculations
    const rowHeight = 45; // Height of each table row
    const minPageSize = 2; // Minimum records per page
    const maxPageSize = 20; // Maximum records per page
  
    // Base offset for different modes
    const baseOffset = sizeDependOn === 'withoutDropdown'
        ? (height > 800 ? 85 : 160) // Without dropdowns
        : (height > 800 ? 150 : 200); // With dropdowns
  
    // Additional offset for dropdown rows
    const dropdownOffset = dropdownRows * (height > 800 ? 110 : 75);
  
    // Total offset
    const totalOffset = baseOffset + dropdownOffset;
  
    // Calculate available height and base page size
    const availableHeight = height - totalOffset;
    const basePageSize = Math.floor(availableHeight / rowHeight);
  
    // Dynamically control how much to reduce for dropdown rows
    const reductionFactor = 0.5 ; // Adjust this to control reduction (e.g., 0.5 means half a row per dropdown)
    const dynamicAdjustment = Math.ceil(dropdownRows * reductionFactor); // Controlled reduction
  
    // Adjusted page size
    const adjustedPageSize = basePageSize - dynamicAdjustment;
  
    // Ensure adjusted page size falls within the allowed range
    this.pageSize = Math.max(minPageSize, Math.min(adjustedPageSize, maxPageSize));
  
    return this.pageSize;
  }
  
}
