import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TransactionFilter {
  type: 'all' | 'income' | 'expense';
  category: string[];
  amountRange: [number, number];
  merchant: string;
  dateFrom: string;
  dateTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionFilterService {

  private defaultFilter: TransactionFilter = {
    type: 'all',
    category: [],
    amountRange: [0, 500],
    merchant: '',
    dateFrom: '',
    dateTo: ''
  };

  private filterSubject = new BehaviorSubject<TransactionFilter>({ ...this.defaultFilter });

  constructor() { }

  // Get current filter as observable
  getFilter$() {
    return this.filterSubject.asObservable();
  }

  // Get current filter value directly
  getCurrentFilter(): TransactionFilter {
    return this.filterSubject.getValue();
  }

  // Update filter
  updateFilter(updated: Partial<TransactionFilter>) {
    const newFilter = { ...this.getCurrentFilter(), ...updated };
    this.filterSubject.next(newFilter);
  }

  // Reset filter
  resetFilter() {
    this.filterSubject.next({ ...this.defaultFilter });
  }
}
