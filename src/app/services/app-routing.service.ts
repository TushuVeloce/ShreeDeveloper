import { Injectable } from '@angular/core';
import { SessionValues } from './sessionvalues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRouteState } from './approutestate';

@Injectable({
  providedIn: 'root'
})
export class AppRoutingService {

  constructor(private sessionvalues: SessionValues, public router: Router,
    private activatedRoute: ActivatedRoute) { }

  LoginToken: string = '';
  Logout = () => {
    return this.LoginToken
  }

  Login = () => {
    return this.LoginToken = this.sessionvalues.CurrentLoginToken;
  }

  Navigation = async (routerlink: string, data: any) => {
    console.log(data.state);

    let obj = {
      Data: data.state,
      LoginToken: this.sessionvalues.CurrentLoginToken
    }
    await this.router.navigate([routerlink], { state: obj as unknown as AppRouteState});
  }

  getRouterData = () => {
    return window.history.state;
  }
  getLoginToken = () => {
    return history.state;
  }
}
