import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateconversionService } from 'src/app/services/dateconversion.service';

@Component({
  selector: 'app-shared-filter',
  templateUrl: './shared-filter.component.html',
  imports: [FormsModule],
})
export class SharedFilterComponent {
  @Input() masterList: any[] = [];
  @Input() filterFields: string[] = [];
  @Output() filteredList = new EventEmitter<any[]>();

  searchString: string = '';

  constructor(private DateconversionService: DateconversionService) {

  }

  isDateLike(value: any): boolean {
    return (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3}$/.test(value)
    );
  }

  formatIfDate(value: any): string {
    return this.isDateLike(value) ? this.formatDate(value) : value;
  }

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  filterTable(): void {
    const search = this.searchString.toLowerCase();

    if (search) {
      const filtered = this.masterList.filter(item =>
        this.filterFields.some(field => {
          const rawValue = item.p?.[field];
          const valueToCheck = this.formatIfDate(rawValue)?.toString().toLowerCase();
          return valueToCheck?.includes(search);
        })
      );

      this.filteredList.emit(filtered);
    } else {
      this.filteredList.emit(this.masterList);
    }
  }
}
