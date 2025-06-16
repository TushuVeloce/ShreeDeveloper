// import { CanActivateFn } from '@angular/router';

// export const authMobileGuard: CanActivateFn = (route, state) => {
//   return true;
// };

// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Injectable({
  providedIn: 'root'
})
export class authMobileGuard implements CanActivate {

  constructor(private router: Router, private appStateManage: AppStateManageService) { }

  canActivate(): boolean {
    // const token = localStorage.getItem('authToken');
    // const token = this.appStateManage.localStorage.getItem('CurrentLoginToken');
    // const token = this.appStateManage.StorageKey.getItem('CurrentLoginToken');
    const token = this.appStateManage.localStorage.getItem('LoginToken') ? this.appStateManage.localStorage.getItem('LoginToken') : this.appStateManage.StorageKey.getItem('LoginToken');
    if (token) {
      return true;
    }

    this.router.navigate(['mobileapp/auth/login-mobile']);
    return false;
  }
}
