import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-bottomsheet',
  templateUrl: './filter-bottomsheet.component.html',
  styleUrls: ['./filter-bottomsheet.component.scss'],
  standalone: false
})

export class FilterBottomsheetComponent implements OnInit, OnDestroy {
  @Input() filters: any[] = [];  // [{ label, value, options: [{label, value}] }]
  @Input() currentFilters: { [key: string]: string } = {}; // passed from parent

  selectedCategory: string | null = null;
  selectedFilters: { [key: string]: string } = {};

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.selectedFilters = { ...this.currentFilters };
  }

  get selectedOptions() {
    return this.filters.find(f => f.value === this.selectedCategory)?.options || [];
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  clearFilters() {
    this.selectedFilters = {};
    this.selectedCategory = null;
    const labelValuePairs = this.getLabelValuePairs();
    this.modalCtrl.dismiss({ filters: this.selectedFilters, labelValuePairs });

  }

  applyFilters() {
    const labelValuePairs = this.getLabelValuePairs();
    this.modalCtrl.dismiss({ filters: this.selectedFilters, labelValuePairs });
  }

  getFilterLabel(key: string): string {
    return this.filters.find(f => f.value === key)?.label || key;
  }

  getLabelValuePairs(): { label: string, value: string }[] {
    const result: { label: string, value: string }[] = [];

    for (const key in this.selectedFilters) {
      const category = this.filters.find(f => f.value === key);
      const selectedValue = this.selectedFilters[key];
      const option = category?.options.find((o: any) => o.value === selectedValue);

      if (category && option) {
        result.push({
          label: category.label,
          value: option.label
        });
      }
    }

    return result;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() { }
}
