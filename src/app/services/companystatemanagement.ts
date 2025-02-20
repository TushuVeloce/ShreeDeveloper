import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppStateManageService } from './app-state-manage.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyStateManagement {
  public companyRef: number = 0
  public SelectedCompanyRef = signal<number>(this.companyRef);
  public SelectedCompanyName = signal<string>('');
    constructor(private appStateManage : AppStateManageService) {
    // this.companyRef = appStateManage.getTheme() == 'dark'? 'dark':'light' 

  }


  setCompanyRef(companyRef: number, companyName: string) {
    this.SelectedCompanyRef.set(companyRef);
    this.SelectedCompanyName.set(companyName);
    localStorage.setItem('SelectedCompanyRef',companyRef.toString());
    localStorage.setItem('companyName', companyName);
  }
  getCurrentCompanyRef(): number {
    return this.SelectedCompanyRef();
  }

  getCurrentCompanyName(): string {
    return this.SelectedCompanyName(); // Returns the current signal value
  }

}