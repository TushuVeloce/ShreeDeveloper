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
