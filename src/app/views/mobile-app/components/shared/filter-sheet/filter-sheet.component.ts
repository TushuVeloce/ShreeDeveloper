import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { UIUtils } from 'src/app/services/uiutils.service';

export interface Option {
  Ref: number;
  Name: string;
}

export interface Category {
  Ref: number;
  Name: string;
  multi: boolean;
  date: boolean;
  dependUponRef: number;
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

  ExpenseTypeList: ExpenseType[] = [];
  selectedOptions: { [categoryRef: number]: number[] } = {};
  // selectedCategory: Category | null = null;
  selectedCategory: Category | any = [];
  selectedDate: string | null = null; 
  selectedDates: { [categoryRef: number]: string|null } = {};
  constructor(private modalCtrl: ModalController, private uiUtils: UIUtils) { }
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

  DateChange(categoryRef: number, value: string) {
    this.selectedDates[categoryRef] = value;
    // console.log(`Selected date for ${categoryRef}: ${value}`);
  }
  

  // toggleOption(categoryRef: number, optionRef: number) {
  //   const category = this.data.categories.find(c => c.Ref === categoryRef);
  //   if (!category) return;

  //   if (category.multi) {
  //     const options = this.selectedOptions[categoryRef] || [];
  //     if (options.includes(optionRef)) {
  //       this.selectedOptions[categoryRef] = options.filter(ref => ref !== optionRef);
  //     } else {
  //       this.selectedOptions[categoryRef] = [...options, optionRef];
  //     }
  //   } else {
  //     this.selectedOptions[categoryRef] = [optionRef];
  //   }
  // }
  toggleOption(categoryRef: number, optionRef: number) {
    const category = this.getCategoryByRef(categoryRef);
    if (!category) return;

    // Handle selection (single or multi)
    if (category.multi) {
      const options = this.selectedOptions[categoryRef] || [];
      this.selectedOptions[categoryRef] = options.includes(optionRef)
        ? options.filter(ref => ref !== optionRef)
        : [...options, optionRef];
    } else {
      this.selectedOptions[categoryRef] = [optionRef];
    }

    // 🚨 Handle dependents
    for (const dependent of this.data.categories) {
      if (dependent.dependUponRef === categoryRef) {
        const parentSelectedRef = this.selectedOptions[categoryRef]?.[0] ?? 0;

        // Clear dependent category's previous selection
        this.selectedOptions[dependent.Ref] = [];

        // 🧠 Example: For Expense Type (Ref: 300), fetch dynamically based on Stage
        if (dependent.Ref === 300 && categoryRef === 200 && parentSelectedRef > 0) {
          this.getExpenseListByStageRef(parentSelectedRef).then(() => {
            dependent.options = this.ExpenseTypeList.map(item => ({
              Ref: item.p.Ref,
              Name: item.p.Name
            }));
          });
        } else {
          // For other dependencies, you could add similar dynamic logic
          dependent.options = []; // Clear or replace with logic if needed
        }
      }
    }
  }
  

  getCategoryByRef(ref: number): Category | undefined {
    return this.data.categories.find(cat => cat.Ref === ref);
  }
  
  isSelected(categoryRef: number, optionRef: number): boolean {
    return this.selectedOptions[categoryRef]?.includes(optionRef) ?? false;
  }

  hasAnySelection(categoryRef: number): boolean {
    return (this.selectedOptions[categoryRef]?.length ?? 0) > 0;
  }
  getExpenseListByStageRef = async (StageRef: number) => {
    if (StageRef <= 0) {
      await this.uiUtils.showErrorToster('Stage not Selected');
      return;
    }
    let lst = await ExpenseType.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ExpenseTypeList = lst;
  }

  // applyFilters() {
  //   const selected = Object.entries(this.selectedOptions).map(([catRefStr, optionRefs]) => {
  //     const catRef = Number(catRefStr);
  //     const category = this.data.categories.find(c => c.Ref === catRef);

  //     const selectedOptions = category?.options.filter(opt =>
  //       (optionRefs as number[]).includes(opt.Ref)
  //     ) ?? [];

  //     return {
  //       category: category
  //         ? { Ref: category.Ref, Name: category.Name }
  //         : { Ref: catRef, Name: 'Unknown' },
  //       selectedOptions: selectedOptions.map(opt => ({
  //         Ref: opt.Ref,
  //         Name: opt.Name
  //       }))
  //     };
  //   });

  //   this.modalCtrl.dismiss({ selected });
  // }
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

    // Add selected date filters
    for (const cat of this.data.categories.filter(c => c.date)) {
      const dateValue = this.selectedDates[cat.Ref];
      if (dateValue) {
        selected.push({
          category: { Ref: cat.Ref, Name: cat.Name },
          selectedOptions: [{ Ref: 0, Name: dateValue }]
        });
      }
    }

    this.modalCtrl.dismiss({ selected });
  }
  

  clearFilters() {
    this.selectedOptions = {};
    this.modalCtrl.dismiss({});
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
