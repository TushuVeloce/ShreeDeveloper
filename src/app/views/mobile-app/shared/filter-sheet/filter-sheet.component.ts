import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface Option {
  Ref: number;
  Name: string;
}

export interface Category {
  Ref: number;
  Name: string;
  multi: boolean;
  options: Option[];
}

@Component({
  selector: 'app-filter-sheet',
  templateUrl: './filter-sheet.component.html',
  styleUrls: ['./filter-sheet.component.scss'],
  standalone: false
})
export class FilterSheetComponent implements OnInit {
  @Input() data!: { categories: Category[] };
  @Input() selected: {
    category: { Ref: number; Name: string };
    selectedOptions: { Ref: number; Name: string }[];
  }[] = [];
  

  selectedOptions: { [categoryRef: number]: number[] } = {};
  selectedCategory: Category | null = null;
  
  constructor(private modalCtrl: ModalController) { }
  ngOnInit() {
    this.selectedOptions = {};

    for (const filter of this.selected) {
      const catRef = filter.category.Ref;
      const optionRefs = filter.selectedOptions.map(opt => opt.Ref);
      this.selectedOptions[catRef] = optionRefs;
    }

    if (this.data?.categories?.length) {
      this.selectedCategory = this.data.categories[0];
    }
  }
  
  

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  toggleOption(categoryRef: number, optionRef: number) {
    const category = this.data.categories.find(c => c.Ref === categoryRef);
    if (!category) return;

    if (category.multi) {
      const options = this.selectedOptions[categoryRef] || [];
      if (options.includes(optionRef)) {
        this.selectedOptions[categoryRef] = options.filter(ref => ref !== optionRef);
      } else {
        this.selectedOptions[categoryRef] = [...options, optionRef];
      }
    } else {
      this.selectedOptions[categoryRef] = [optionRef];
    }
  }

  isSelected(categoryRef: number, optionRef: number): boolean {
    return this.selectedOptions[categoryRef]?.includes(optionRef) ?? false;
  }

  hasAnySelection(categoryRef: number): boolean {
    return (this.selectedOptions[categoryRef]?.length ?? 0) > 0;
  }
  
  applyFilters() {
    const selected = Object.entries(this.selectedOptions).map(([catRefStr, optionRefs]) => {
      const catRef = Number(catRefStr);
      const category = this.data.categories.find(c => c.Ref === catRef);

      const selectedOptions = category?.options.filter(opt =>
        (optionRefs as number[]).includes(opt.Ref)
      ) ?? [];

      return {
        category: category
          ? { Ref: category.Ref, Name: category.Name }
          : { Ref: catRef, Name: 'Unknown' },
        selectedOptions: selectedOptions.map(opt => ({
          Ref: opt.Ref,
          Name: opt.Name
        }))
      };
    });

    this.modalCtrl.dismiss({ selected });
  }
  

  clearFilters() {
    this.selectedOptions = {};
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
