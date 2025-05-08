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
    this.loadedOptions = this.options.slice(0, this.itemsPerLoad);
    console.log('options :', this.options);
    // this.loadedOptions = this.options.slice(0, this.itemsPerLoad);

    // Ensure selected options are preserved correctly by reference
    // this.selectedOptions = this.options.filter(opt =>
    //   this.selectedOptions.some(sel => sel.p.Ref === opt.p.Ref)
    // );
    // Normalize selected options to use the actual references from options
    const selectedRefs = this.selectedOptions.map(item => item.p.Ref);
    this.selectedOptions = this.options.filter(opt => selectedRefs.includes(opt.p.Ref));

    console.log('Options:', this.options);
    console.log('Selected Options:', this.selectedOptions);
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
  selectOption(option: any) {
    if (this.multiSelect) {
      const exists = this.selectedOptions.some(item => item.p.Ref === option.p.Ref);

      if (exists) {
        this.selectedOptions = this.selectedOptions.filter(item => item.p.Ref !== option.p.Ref);
      } else {
        if (this.selectedOptions.length >= this.MaxSelection) {
          // Optional: Inform the user (you can replace alert with toastController if needed)
          UIUtils.GetInstance().showWarningToster(`You can select up to ${this.MaxSelection} options only.`);
          // alert(`You can select up to ${this.MaxSelection} options only.`);
          return;
        }

        this.selectedOptions = [...this.selectedOptions, option];
      }
    } else {
      this.selectedOptions = [option];
      this.confirmSelection(); // Close modal and pass the selection
    }
  }


  isDisabled(option: any): boolean {
    const isSelected = this.selectedOptions.some(item => item.p.Ref === option.p.Ref);
    return !isSelected && this.selectedOptions.length >= this.MaxSelection;
  }


  isSelected(option: any): boolean {
    return this.selectedOptions.some(item => item.p.Ref === option.p.Ref);
  }

  confirmSelection() {
    this.modalCtrl.dismiss(this.selectedOptions);
  }

  close() {
    this.modalCtrl.dismiss();
    this.confirmSelection();
  }
}
