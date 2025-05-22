import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  filterTable(): void {
    const search = this.searchString.toLowerCase();

    if (search) {
      const filtered = this.masterList.filter(item =>
        this.filterFields.some(field => {
          const value = item.p?.[field];
          return value?.toString().toLowerCase().includes(search);
        })
      );
      this.filteredList.emit(filtered);
    } else {
      this.filteredList.emit(this.masterList);
    }
  }
}
