import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { DTU } from './dtu.service';

@Injectable({
  providedIn: 'root'
})
export class DateconversionService {
  private datePipe = new DatePipe('en-US'); // Create a DatePipe instance

  constructor( private dtu: DTU,
     ) { }
   
     formatDate(dateValue: string | Date): string {
      if (!dateValue) return '';
  
      const parsedDate = (dateValue instanceof Date) ? dateValue : this.dtu.FromString(dateValue);
  
      return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) 
        ? this.datePipe.transform(parsedDate, 'dd-MM-yyyy') || '' 
        : 'Invalid Date';
    }
  }    

