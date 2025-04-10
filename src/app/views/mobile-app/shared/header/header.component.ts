import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone:false
})
export class HeaderComponent  implements OnInit {

  // constructor() { }

  // ngOnInit() {}
  @Input() title: string = 'Default Title';
  constructor(private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() { }
  showHeader(): boolean {
    const hiddenRoutes = [
      '/app_homepage/task/add',
      '/app_homepage/task/edit',
      // '/app_homepage/home',
    ];
    return !hiddenRoutes.includes(this.router.url);
  }
  departments = [
    { id: 1, value: 'company 1' },
    { id: 2, value: 'company 2' },
    { id: 3, value: 'company 3' },
    { id: 4, value: 'company 4' },
    { id: 5, value: 'company 5' },
  ];
  selectedDepartment: any = null;
  // handleDepartmentSelect(item: any) {
  //   this.selectedDepartment = item;
  // }
  options = [
    { id: 1, value: 'Apple' },
    { id: 2, value: 'Banana' },
    { id: 3, value: 'Cherry' },
    { id: 4, value: 'Date' },
    { id: 5, value: 'Elderberry' },
    { id: 6, value: 'Fig' },
    { id: 7, value: 'Grapes' },
    { id: 8, value: 'Honeydew' },
    { id: 9, value: 'Indian Fig' },
    { id: 10, value: 'Jackfruit' },
    { id: 11, value: 'Kiwi' },
    { id: 12, value: 'Lemon' },
    { id: 13, value: 'Mango' },
    { id: 14, value: 'Nectarine' },
    { id: 15, value: 'Orange' },
    { id: 16, value: 'Papaya' },
    { id: 17, value: 'Quince' },
    { id: 18, value: 'Raspberry' },
    { id: 19, value: 'Strawberry' },
    { id: 20, value: 'Tomato' }
  ];

  onSelectionChange(selected: { id: number; value: string }[]) {
    console.log('Selected option:', selected);
  }
  
  goToNotificationPage() {
    console.log('Selected option:','/app_homepage/notifications');
    this.router.navigate(['/app_homepage/notifications']);
    // this.router.navigate(['/notifications']);
  }
}
