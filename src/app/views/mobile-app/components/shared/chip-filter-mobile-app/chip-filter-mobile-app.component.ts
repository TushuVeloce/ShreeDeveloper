import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';

interface FilterOption {
  Ref: string | number;
  Name: string;
}

export interface FilterItem {
  key: string;
  label: string;
  multi: boolean;
  options: FilterOption[];
  selected: any; // could be `any[]` or `any` depending on `multi`
}

@Component({
  selector: 'app-chip-filter-mobile-app',
  templateUrl: './chip-filter-mobile-app.component.html',
  styleUrls: ['./chip-filter-mobile-app.component.scss'],
  standalone:false
})
export class ChipFilterMobileAppComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() filters: any[] = [];
  @Output() filtersChanged = new EventEmitter<any[]>();

  clearFilter(filterKey: string) {
    const filter = this.filters.find(f => f.key === filterKey);
    if (!filter) return;
    filter.selected = filter.multi ? [] : null;
    this.emitFilters();
  }

  clearAllFilters() {
    this.filters.forEach(f => {
      f.selected = f.multi ? [] : null;
    });
    this.emitFilters();
  }

  onFilterChange(filterKey: string, value: any) {
  // console.log('value :', value);
  // console.log('filterKey :', filterKey);
    const filter = this.filters.find(f => f.key === filterKey);
    filter.selected = value;
    this.emitFilters();
  }

  getSelectedNames(filter: { multi: boolean; label: string; options: FilterOption[]; selected: any }): string {
    // console.log('FilterOption :', filter.options);
    if (filter.multi) {
      if (!filter.selected || filter.selected.length === 0) return filter.label;

      const names = filter.options
        .filter((opt: FilterOption) => filter.selected.includes(opt.Ref))
        .map((opt: FilterOption) => opt.Name);
      return `${filter.label}: ${names.join(', ')}`;
    } else {
      const selected = filter.options.find((opt: FilterOption) => opt.Ref === filter.selected);
      return selected ? `${filter.label}: ${selected.Name}` : filter.label;
    }
  }


  private emitFilters() {
    this.filtersChanged.emit(this.filters);
  }

}
