import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface Category {
  name: string;
  multi: boolean;
  options: string[];
}

@Component({
  selector: 'app-filter-sheet',
  templateUrl: './filter-sheet.component.html',
  styleUrls: ['./filter-sheet.component.scss'],
  standalone: false
})
export class FilterSheetComponent implements OnInit {

  @Input() data!: { categories: Category[] };
  @Input() selected: { [category: string]: string[] } = {};

  selectedOptions: { [category: string]: string[] } = {};
  selectedCategory: Category | null = null;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // Pre-fill selected filters if available
    this.selectedOptions = { ...this.selected };

    // Initialize selectedCategory to first category if exists
    if (this.data?.categories?.length) {
      this.selectedCategory = this.data.categories[0];
    }
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  toggleOption(category: string, option: string) {
    const isMulti = this.data.categories.find((c: Category) => c.name === category)?.multi;

    if (isMulti) {
      // Multiselect
      const options = this.selectedOptions[category] || [];
      if (options.includes(option)) {
        this.selectedOptions[category] = options.filter(o => o !== option);
      } else {
        this.selectedOptions[category] = [...options, option];
      }
    } else {
      // Singleselect - replace with the selected option
      this.selectedOptions[category] = [option];
    }
  }

  isSelected(category: string, option: string): boolean {
    return this.selectedOptions[category]?.includes(option) ?? false;
  }

  hasAnySelection(category: string): boolean {
    return (this.selectedOptions[category]?.length ?? 0) > 0;
  }

  applyFilters() {
    this.modalCtrl.dismiss({ selected: this.selectedOptions });
  }

  clearFilters() {
    this.selectedOptions = {};
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
