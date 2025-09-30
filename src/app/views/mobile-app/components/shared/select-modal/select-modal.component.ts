import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
  standalone: false
})
export class SelectModalComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() selectedOptions: any[] = [];
  @Input() multiSelect: boolean = false;
  @Input() bottomsheetTitle: string = 'select options';
  @Input() MaxSelection: number = 1;
  searchText: string = '';
  loadedOptions: any[] = [];
  itemsPerLoad: number = 20;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const selectedRefs = this.selectedOptions.map(item =>
      String(item?.p?.Ref ?? item?.Ref)
    );
    this.selectedOptions = this.options.filter(opt =>
      selectedRefs.includes(String(opt?.p?.Ref))
    );
    this.loadedOptions = this.options.slice(0, this.itemsPerLoad);
  }

  filterOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.loadedOptions = this.options.filter(option =>
        option.p.Name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.loadedOptions = this.options.slice(0, this.itemsPerLoad);
    }
  }

  loadMore(event: any) {
    setTimeout(() => {
      const nextItems = this.options.slice(this.loadedOptions.length, this.loadedOptions.length + this.itemsPerLoad);
      this.loadedOptions = [...this.loadedOptions, ...nextItems];
      event.target.complete();

      if (this.loadedOptions.length >= this.options.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  /**
   * Manages the selection and deselection of options,
   * including exclusive logic for 'Other Expense' (Ref: 115)
   * when bottomsheetTitle is 'Select Expense Type'.
   * @param option The option being selected or deselected.
   */
  selectOption(option: any) {
    // Handle single select (non-multiSelect) as before
    if (!this.multiSelect) {
      this.selectedOptions = [option];
      this.confirmSelection();
      return;
    }

    // Multi-select logic
    const OTHER_EXPENSE_REF = 115;
    const isOtherExpense = option.p.Ref === OTHER_EXPENSE_REF;
    const isExpenseTypeModal = this.bottomsheetTitle === 'Select Expense Type';
    const exists = this.isSelected(option); // Check if the current option is already selected

    if (isExpenseTypeModal) {
      const isOtherExpenseCurrentlySelected = this.selectedOptions.some(item => item.p.Ref === OTHER_EXPENSE_REF);
      
      // Case 1: Selecting 'Other Expense' (Ref: 115)
      if (isOtherExpense && !exists) {
        // Selecting 'Other Expense' deselects all others
        this.selectedOptions = [option];
        return;
      } 
      
      // Case 2: Deselecting 'Other Expense' (Ref: 115)
      else if (isOtherExpense && exists) {
        // Deselect 'Other Expense'
        this.selectedOptions = this.selectedOptions.filter(item => item.p.Ref !== OTHER_EXPENSE_REF);
        return;
      }

      // Case 3: Selecting any other option when 'Other Expense' is currently selected
      if (!isOtherExpense && isOtherExpenseCurrentlySelected) {
        // Selecting a non-other option should deselect 'Other Expense'
        this.selectedOptions = this.selectedOptions.filter(item => item.p.Ref !== OTHER_EXPENSE_REF);
      }
    }
    
    // Standard multi-select logic (used for all other cases, including when 
    // 'Other Expense' is not involved or when it's not the Expense Type modal)

    if (exists) {
      // Deselect
      this.selectedOptions = this.selectedOptions.filter(item => item.p.Ref !== option.p.Ref);
    } else {
      // Check Max Selection limit before selecting
      if (this.selectedOptions.length >= this.MaxSelection) {
        UIUtils.GetInstance().showWarningToster(`You can select up to ${this.MaxSelection} options only.`);
        return;
      }

      // Select
      this.selectedOptions = [...this.selectedOptions, option];
    }
  }

   // NOTE: This function is now redundant for the exclusive logic, which is handled in selectOption.
   checkConditionOfExpenseType(option: any): any {
      return null; // Logic is now in selectOption
   }

  isDisabled(option: any): boolean {
    // Check for the exclusive condition when it's an Expense Type modal
    const isExpenseTypeModal = this.bottomsheetTitle === 'Select Expense Type';
    const OTHER_EXPENSE_REF = 115;
    const isOtherExpenseCurrentlySelected = this.selectedOptions.some(item => item.p.Ref === OTHER_EXPENSE_REF);
    
    // If 'Other Expense' is selected, all other options are disabled
    if (isExpenseTypeModal && isOtherExpenseCurrentlySelected && option.p.Ref !== OTHER_EXPENSE_REF) {
      return true;
    }

    // Standard MaxSelection disabling logic
    return this.multiSelect &&
      this.selectedOptions.length >= this.MaxSelection &&
      !this.isSelected(option);
  }


  isSelected(option: any): boolean {
    return this.selectedOptions.some(item => item.p.Ref === option.p.Ref);
  }
  isSiteSelected(option: any): boolean {
    return this.selectedOptions.some(item => item.p.IsSiteRef === 1);
  }

  confirmSelection() {
    this.modalCtrl.dismiss(this.selectedOptions);
  }

  close() {
    this.modalCtrl.dismiss(this.selectedOptions);
  }

}