import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Injectable({
  providedIn: 'root'
})
export class loginMobileGuard implements CanActivate {

  constructor(private router: Router, private appStateManage: AppStateManageService) { }

  canActivate(): boolean {
    const token =
      this.appStateManage.localStorage.getItem('LoginToken')

    if (token) {
      this.router.navigate(['mobile-app/tabs'], { replaceUrl: true });
      return false;
    }

    return true;
  }
}
