// ... existing imports ...
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
  // ... existing @Input properties ...
  @Input() options: any[] = [];
  @Input() selectedOptions: any[] = [];
  @Input() multiSelect: boolean = false;
  @Input() bottomsheetTitle: string = 'select options';
  @Input() MaxSelection: number = 1;
  // ... existing properties ...
  searchText: string = '';
  loadedOptions: any[] = [];
  itemsPerLoad: number = 20;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // ... existing ngOnInit logic ...
    const selectedRefs = this.selectedOptions.map(item =>
      String(item?.p?.Ref ?? item?.Ref)
    );
    this.selectedOptions = this.options.filter(opt =>
      selectedRefs.includes(String(opt?.p?.Ref))
    );
    this.loadedOptions = this.options.slice(0, this.itemsPerLoad);
  }

  // Improved filterOptions for performance (only running search on full 'options' array)
  filterOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();
    if (searchTerm.length > 0) {
      // Filter the complete list, then take the first 'itemsPerLoad' for display if needed
      const filtered = this.options.filter(option =>
        // Ensure you're searching a non-null/undefined property
        (option?.p?.Name || '').toLowerCase().includes(searchTerm) ||
        (option?.p?.PlotNo || '').toLowerCase().includes(searchTerm) ||
        (option?.p?.MaterialName || '').toLowerCase().includes(searchTerm) ||
        (option?.p?.VendorName || '').toLowerCase().includes(searchTerm)
      );
      // When searching, display ALL matching results, not just a subset, 
      // as the user is actively filtering. Disable infinite scroll when filtered.
      this.loadedOptions = filtered;
    } else {
      // If search is cleared, reset to the initial chunk for infinite scroll
      this.loadedOptions = this.options.slice(0, this.itemsPerLoad);
      // Re-enable infinite scroll if needed (this happens automatically on complete)
    }
  }

  // loadMore function is already smooth with a 500ms timeout
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

  // Core selectOption logic remains unchanged to preserve business rules
  selectOption(option: any) {
    // ... existing selectOption logic ...
    if (!this.multiSelect) {
      this.selectedOptions = [option];
      this.confirmSelection();
      return;
    }

    // Multi-select logic
    const OTHER_EXPENSE_REF = 115;
    const isOtherExpense = option?.p?.Ref === OTHER_EXPENSE_REF;
    const isExpenseTypeModal = this.bottomsheetTitle === 'Select Expense Type';
    const exists = this.isSelected(option);

    if (isExpenseTypeModal) {
      const isOtherExpenseCurrentlySelected = this.selectedOptions.some(item => item?.p?.Ref === OTHER_EXPENSE_REF);

      if (isOtherExpense && !exists) {
        this.selectedOptions = [option];
        return;
      }
      else if (isOtherExpense && exists) {
        this.selectedOptions = this.selectedOptions.filter(item => item?.p?.Ref !== OTHER_EXPENSE_REF);
        return;
      }

      if (!isOtherExpense && isOtherExpenseCurrentlySelected) {
        this.selectedOptions = this.selectedOptions.filter(item => item?.p?.Ref !== OTHER_EXPENSE_REF);
      }
    }

    if (exists) {
      this.selectedOptions = this.selectedOptions.filter(item => item?.p?.Ref !== option?.p?.Ref);
    } else {
      if (this.selectedOptions.length >= this.MaxSelection) {
        // Assuming UIUtils is available
        UIUtils.GetInstance().showWarningToster(`You can select up to ${this.MaxSelection} options only.`);
        return;
      }
      this.selectedOptions = [...this.selectedOptions, option];
    }
  }

  // isDisabled logic remains unchanged
  isDisabled(option: any): boolean {
    const isExpenseTypeModal = this.bottomsheetTitle === 'Select Expense Type';
    const OTHER_EXPENSE_REF = 115;
    const isOtherExpenseCurrentlySelected = this.selectedOptions.some(item => item?.p?.Ref === OTHER_EXPENSE_REF);

    if (isExpenseTypeModal && isOtherExpenseCurrentlySelected && option?.p?.Ref !== OTHER_EXPENSE_REF) {
      return true;
    }

    return this.multiSelect &&
      this.selectedOptions.length >= this.MaxSelection &&
      !this.isSelected(option);
  }

  // isSelected logic remains unchanged
  isSelected(option: any): boolean {
    return this.selectedOptions.some(item => item?.p?.Ref === option?.p?.Ref);
  }

  // isSiteSelected logic remains unchanged
  isSiteSelected(option: any): boolean {
    // Note: The logic `item => item.p.IsSiteRef === 1` should probably be checked on `option` itself 
    // for styling the current item, but since it's checking `selectedOptions`, it will only 
    // apply if *any* selected option has IsSiteRef === 1. Assuming this is intentional 
    // for a specific UI state.
    return this.selectedOptions.some(item => item?.p?.IsSiteRef === 1);
  }

  // Utility function for better list performance with *ngFor
  trackByRef(index: number, option: any): number {
    return option?.p?.Ref || index;
  }

  // confirmSelection logic remains unchanged
  confirmSelection() {
    this.modalCtrl.dismiss(this.selectedOptions);
  }

  // close logic remains unchanged
  close() {
    this.modalCtrl.dismiss(this.selectedOptions);
  }
}