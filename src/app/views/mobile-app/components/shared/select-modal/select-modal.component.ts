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

  selectOption(option: any) {
    if (this.multiSelect) {
      const exists = this.selectedOptions.some(item => item.p.Ref === option.p.Ref);

      if (exists) {
        this.selectedOptions = this.selectedOptions.filter(item => item.p.Ref !== option.p.Ref);
      } else {
        if (this.selectedOptions.length >= this.MaxSelection) {
          UIUtils.GetInstance().showWarningToster(`You can select up to ${this.MaxSelection} options only.`);
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
