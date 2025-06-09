// import { CanActivateFn } from '@angular/router';

// export const loginMobileGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Injectable({
  providedIn: 'root'
})
export class loginMobileGuard implements CanActivate {

  constructor(private router: Router, private appStateManage: AppStateManageService) { }

  canActivate(): boolean {
    // const token = localStorage.getItem('authToken');
    // const token = this.appStateManage.localStorage.getItem('CurrentLoginToken');
    // const token = this.appStateManage.StorageKey.getItem('CurrentLoginToken');
    const token = this.appStateManage.localStorage.getItem('CurrentLoginToken') ? this.appStateManage.localStorage.getItem('CurrentLoginToken') : this.appStateManage.StorageKey.getItem('CurrentLoginToken');
    if (token) {
      this.router.navigate(['mobileapp/tabs/dashboard'], { replaceUrl: true });
      return false;
    }

    return true;
  }
}
