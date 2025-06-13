import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransactionFilterService } from '../../core/transaction-filter.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.scss'],
  standalone: false
})
export class TransactionFilterComponent implements OnInit {

  ngOnInit() { }


  constructor(
    private filterService: TransactionFilterService,
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      type: [''],
      category: [[]],
      amount: [[0, 500]],
      merchant: [''],
      dateFrom: [''],
      dateTo: ['']
    });
   }

  @Output() applyFilter = new EventEmitter<any>();
  @Output() resetFilter = new EventEmitter<void>();

  filterForm: FormGroup;
  categories = ['Health & Fitness', 'Savings', 'Shopping', 'Bills'];
  merchants = ['Amazon', 'Flipkart', 'Walmart', 'Target'];

  toggleCategory(cat: string) {
    const selected = this.filterForm.value.category as string[];
    const index = selected.indexOf(cat);
    if (index >= 0) selected.splice(index, 1);
    else selected.push(cat);
    this.filterForm.patchValue({ category: [...selected] });
  }

  onApply() {
    this.applyFilter.emit(this.filterForm.value);
  }

  onReset() {
    this.filterForm.reset({
      type: '',
      category: [],
      amount: [0, 500],
      merchant: '',
      dateFrom: '',
      dateTo: ''
    });
    this.resetFilter.emit();
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  // applyFilters() {
  //   this.filterService.updateFilter({
  //     type: this.selectedType,
  //     category: this.selectedCategories,
  //     amountRange: [this.minAmount, this.maxAmount],
  //     merchant: this.selectedMerchant,
  //     dateFrom: this.dateFrom,
  //     dateTo: this.dateTo
  //   });

  //   this.modalCtrl.dismiss(true); // pass success if needed
  // }

  resetFilters() {
    this.filterService.resetFilter();
  }

}
