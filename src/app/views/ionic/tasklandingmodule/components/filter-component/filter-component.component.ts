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

  filterCategories = [
    { label: 'Owner Name', key: 'ownerName' },
    { label: 'Type', key: 'type' },
    { label: 'Status', key: 'status' },
  ];

  filterOptions: { [key: string]: string[] } = {
    ownerName: ['Owner 1', 'Owner 2', 'Owner 3'],
    type: ['Type 1', 'Type 2', 'Type 3'],
    status: ['Active', 'Inactive', 'Pending'],
  };

  filters: { [key: string]: string | null } = {
    ownerName: null,
    type: null,
    status: null,
  };

  selectedFilter: string = '';
  selectedFilterOptions: string[] = [];

  ngOnInit() { }

  // Select a main filter and show its options
  selectFilter(filter: { label: string; key: string }) {
    this.selectedFilter = filter.key;
    this.selectedFilterOptions = this.filterOptions[filter.key] ?? [];
  }

  // Toggle the filter selection (only one option can be selected per filter)
  toggleFilter(filterKey: string, option: string) {
    // If the same option is clicked again, deselect it
    if (this.filters[filterKey] === option) {
      this.filters[filterKey] = null;
    } else {
      this.filters[filterKey] = option;
    }
  }

  // Apply selected filters
  applyFilters() {
    console.log('Applied Filters:', this.filters);
    this.dismissModal();
  }

  // Close the modal
  dismissModal() {
    this.modalController.dismiss();
  }

  // Check if a filter has been selected (for the dot)
  isFilterSelected(filterKey: string): boolean {
    return this.filters[filterKey] !== null;
  }
  clearFilters() {
    this.filters = {
      ownerName: null,
      type: null,
      status: null,
    };
    this.dismissModal();
  }
}
