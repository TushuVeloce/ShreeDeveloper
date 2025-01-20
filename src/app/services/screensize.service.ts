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

  getPageSize(sizeDependOn: string): number {
    const height = window.innerHeight;
  
    // Base row height; adjust as needed
    let rowHeight = 50; // Smaller row height on smaller screens
  
    // Dynamic offset for different screen sizes
    const offset = sizeDependOn === 'withoutDropdown'
      ? (height > 800 ? 85 : 160)  // Larger offset for larger screens
      : (height > 800 ? 200 : 270); // Smaller offset on smaller screens
  
    // Calculate available height and page size
    const availableHeight = height - offset;
    const calculatedPageSize = Math.floor(availableHeight / rowHeight);
  
    // Set a minimum and maximum for page size
    this.pageSize = Math.max(5, Math.min(calculatedPageSize, 20)); // Adjust this range if needed
    return this.pageSize;
  }
  
}
