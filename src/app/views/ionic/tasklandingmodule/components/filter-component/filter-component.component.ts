import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-component',
  templateUrl: './filter-component.component.html',
  styleUrls: ['./filter-component.component.scss'],
  standalone: false,
})
export class FilterComponentComponent implements OnInit {
  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  // Main Filter Categories (Dynamic list)
  filterCategories = [
    { label: 'Owner Name', key: 'ownerName' },
    { label: 'Type', key: 'type' },
    { label: 'Status', key: 'status' },
  ];

  // Available options for each filter category
  filterOptions: { [key: string]: string[] } = {
    ownerName: ['Owner 1', 'Owner 2', 'Owner 3'],
    type: ['Type 1', 'Type 2', 'Type 3'],
    status: ['Active', 'Inactive', 'Pending'],
  };

  // Object to store selected filter values
  filters: { [key: string]: string | null } = {
    ownerName: null,
    type: null,
    status: null,
  };

  // Selected Filter Category
  selectedFilter: string = '';

  // Get options for the selected filter category
  getFilterOptions(filterKey: string): string[] {
    return this.filterOptions[filterKey] ?? [];
  }

  // Select a filter category (click handler)
  selectFilter(filter: { label: string; key: string }) {
    this.selectedFilter = filter.key;
  }

  // Dismiss Modal
  dismissModal() {
    this.modalController.dismiss();
  }

  // Apply Filters
  applyFilters() {
    console.log('Applied Filters:', this.filters);
    this.dismissModal();
  }
}
