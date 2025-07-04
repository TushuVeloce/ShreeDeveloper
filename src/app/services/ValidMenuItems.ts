import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppStateManageService } from './app-state-manage.service';

export interface MenuItem {
  FeatureRef: number;
  FeatureName: string;
  FeatureGroupRef: number;
  CanAdd: boolean;
  CanEdit: boolean;
  CanDelete: boolean;
  CanView: boolean;
  CanPrint: boolean;
  CanExport: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ValidMenuItemsStateManagement {
  public ValidMenuItems: MenuItem[] = [];
  public SelectedValidMenuItems = signal<MenuItem[]>(this.ValidMenuItems);
  constructor(private appStateManagement: AppStateManageService) {
    // this.companyRef = appStateManage.getTheme() == 'dark'? 'dark':'light'

  }


  setValidMenuItems(ValidMenuItems: MenuItem[]) {
    this.SelectedValidMenuItems.set(ValidMenuItems);
    // this.appStateManagement.StorageKey.setItem('SelectedCompanyRef', companyRef.toString());
    // this.appStateManagement.StorageKey.setItem('companyName', companyName);
  }


  getData(FeatureRef: number): MenuItem {
    return this.SelectedValidMenuItems().filter(item => item.FeatureRef === FeatureRef)[0];
  }


  getCurrentCompanyRef(): MenuItem[] {
    return this.SelectedValidMenuItems();
  }
}
