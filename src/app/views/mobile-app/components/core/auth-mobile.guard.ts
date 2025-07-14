import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Injectable({
  providedIn: 'root'
})
export class authMobileGuard implements CanActivate {

  constructor(private router: Router, private appStateManage: AppStateManageService) { }

  canActivate(): boolean {
    const token =
      this.appStateManage.localStorage.getItem('LoginToken') ||
      this.appStateManage.StorageKey.getItem('LoginToken');

    if (token) {
      return true;
    }

    this.router.navigate(['mobile-app/auth/login']);
    return false;
  }
}
