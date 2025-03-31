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
    { id: 1, name: 'company 1' },
    { id: 2, name: 'company 2' },
    { id: 3, name: 'company 3' },
    { id: 4, name: 'company 4' },
    { id: 5, name: 'company 5' },
  ];
  selectedDepartment: any = null;
  // handleDepartmentSelect(item: any) {
  //   this.selectedDepartment = item;
  // }

}
