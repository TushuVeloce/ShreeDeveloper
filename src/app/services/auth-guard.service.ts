// import { Injectable, isDevMode } from '@angular/core';
// import { CanLoad, Route, UrlSegment, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { SessionValues } from './sessionvalues.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanLoad, CanActivate {
//   constructor(private sessionValues: SessionValues,
//     private router: Router) { }

//   canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
//     if (isDevMode()) return true;

//     if (!this.sessionValues.isAuthenticated())
//     {
//       this.router.navigateByUrl('/login');
//     }
//     else
//     {
//       return true;
//     }
//   }

//   canLoad(_route: Route, _segments: UrlSegment[]) {
//     if (isDevMode()) return true;

//     if (!this.sessionValues.isAuthenticated())
//     {
//       this.router.navigateByUrl('/login');
//     }
//     else
//     {
//       return true;
//     }
//   }
// }


// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AppStateManageService } from './app-state-manage.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router, private appStateManage: AppStateManageService) { }

//   canActivate(): boolean {
//     const isLoggedIn = !!this.appStateManage.StorageKey.getItem('CurrentLoginToken'); // or your logic
//     if (isLoggedIn) {
//       return true;
//     } else {
//       this.router.navigate(['/login']); // redirect if not logged in
//       return false;
//     }
//   }
// }



import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AppStateManageService } from './app-state-manage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private appStateManage: AppStateManageService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = !!this.appStateManage.StorageKey.getItem('CurrentLoginToken'); // or your logic
    if (isLoggedIn) {
      // return true;
      const featureName = route.data['featureName'];
      const validMenuItems = JSON.parse(this.appStateManage.StorageKey.getItem('ValidMenuItems') || '[]');

      const matchedFeature = validMenuItems.find((item: any) => item.FeatureName === featureName);
      return true;

      // if (matchedFeature && matchedFeature.CanView) {
      //   return true;

      // } else {
      //   this.router.navigate(['/login']); // or show access denied page
      //   return false;
      // }
    } else {
      this.router.navigate(['/login']); // redirect if not logged in
      return false;
    }

  }
}

