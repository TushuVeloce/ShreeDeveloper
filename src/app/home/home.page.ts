import { Component } from '@angular/core';
import { AppStateManageService } from '../services/app-state-manage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private appStateManage: AppStateManageService) {}

   async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
  }

}
