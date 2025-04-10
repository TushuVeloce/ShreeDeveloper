import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
  standalone:false
})
export class SelectModalComponent  implements OnInit {
  @Input() options: { id: number; value: string }[] = [];
  @Input() selectedOptions: { id: number; value: string }[] = [];
  @Input() multiSelect: boolean = false;

  searchText: string = '';
  loadedOptions: { id: number; value: string }[] = [];
  itemsPerLoad: number = 20;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.loadedOptions = this.options.slice(0, this.itemsPerLoad);
  }

  filterOptions(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.loadedOptions = this.options.filter(option =>
        option.value.toLowerCase().includes(searchTerm)
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
      if (this.selectedOptions.includes(option)) {
        this.selectedOptions = this.selectedOptions.filter(item => item !== option);
      } else {
        this.selectedOptions.push(option);
      }
    } else {
      this.selectedOptions = [option];
      this.confirmSelection(); // Close modal and pass the selection
    }
  }


  isSelected(option: { id: number; value: string }): boolean {
    return this.selectedOptions.some(item => item.id === option.id);
  }

  confirmSelection() {
    this.modalCtrl.dismiss(this.selectedOptions);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
