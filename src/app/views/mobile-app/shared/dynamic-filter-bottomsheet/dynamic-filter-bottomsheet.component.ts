import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dynamic-filter-bottomsheet',
  templateUrl: './dynamic-filter-bottomsheet.component.html',
  styleUrls: ['./dynamic-filter-bottomsheet.component.scss'],
  standalone:false
})
export class DynamicFilterBottomsheetComponent  implements OnInit {

  ngOnInit() {}
  @Input() filters: any[] = []; // [{ label: 'Category', type: 'select', options: ['A', 'B'] }]
  @Input() originalData: any[] = []; // [{ label: 'Category', type: 'select', options: ['A', 'B'] }]
  filterData: any = {};
  filteredData: any[] = [];
  

  constructor(private modalCtrl: ModalController) { }

  applyFilters() {
    this.applyDynamicFilter(this.filterData);
    this.modalCtrl.dismiss(this.filteredData);
  }
  applyDynamicFilter(filters: any) {
    this.filteredData = this.originalData.filter(item => {
      return Object.keys(filters).every(key => {
        const value = filters[key];

        if (!value) return true; // Skip empty filters

        const normalizedKey = key.toLowerCase();

        if (normalizedKey.includes('date') || normalizedKey.includes('time')) {
          const itemDate = new Date(item.date);
          const filterDate = new Date(value);

          if (normalizedKey.includes('start')) {
            return itemDate >= filterDate;
          }

          if (normalizedKey.includes('end')) {
            return itemDate <= filterDate;
          }

          return true;
        }

        if (typeof item[key.toLowerCase()] === 'string') {
          return item[key.toLowerCase()]?.toLowerCase().includes(value.toLowerCase());
        }

        return item[key.toLowerCase()] === value;
      });
    });
  }


  close() {
    this.modalCtrl.dismiss();
  }
  clearFilters() {
    this.filterData = {};
  }


}
