import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStateManageService } from './services/app-state-manage.service';
import { SessionValues } from './services/sessionvalues.service';

@Injectable()
export class ImageInterceptor implements HttpInterceptor {

  constructor(private sessionValues: SessionValues,private AppStateManageService: AppStateManageService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authToken = this.sessionValues.CurrentLoginToken;
    let authTokenForMobileApp = this.AppStateManageService.getLoginTokenForMobile();

    // cloned headers, updated with the authorization.
   const headers = request.headers.set('LoginToken', authToken? authToken: authTokenForMobileApp);
    const authReq = request.clone({headers});

    // Clone the request and set the new header in one step.
// const authReq = request.clone({ setHeaders: { LoginToken: authToken } });

    // send cloned request with header to the next handler.
    return next.handle(authReq);

  }
}
