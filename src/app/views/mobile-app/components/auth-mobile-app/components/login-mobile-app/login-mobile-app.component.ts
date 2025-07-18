import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { HapticService } from '../../../core/haptic.service';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ToastService } from '../../../core/toast.service';
import { UserLoginRequest } from 'src/app/classes/infrastructure/request_response/userloginrequest';

@Component({
  selector: 'app-login-mobile-app',
  templateUrl: './login-mobile-app.component.html',
  styleUrls: ['./login-mobile-app.component.scss'],
  standalone: false
})
export class LoginMobileAppComponent  implements OnInit {

  loginForm!: FormGroup;
  isLoggingIn = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private servercommunicator: ServerCommunicatorService,
    private sessionValues: SessionValues,
    private haptic: HapticService,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit = async () => {
    if (this.loginForm.invalid) return;
    this.isLoggingIn = true;
    const { email, password } = this.loginForm.value;

    let req = new UserLoginRequest();
    req.UserId = email;
    req.Password = password;
    req.LoginDeviceId = this.sessionValues.MobileLoginDeviceId;

    const response = await this.servercommunicator.LoginUser(req);
 
    if (!response.Successful) {
      this.isLoggingIn = false;
      this.toastService.present(response.Message, 2000, 'danger');
      await this.haptic.error();
      return;
    }

    //  Store session values
    this.appStateManage.setEmployeeRef(response.LoginEmployeeRef);
    this.appStateManage.setLoginTokenForMobile(response.LoginToken);
    this.companystatemanagement.setCompanyRef(response.LastSelectedCompanyRef, response.CompanyName);

    this.appStateManage.localStorage.setItem('LoginToken', response.LoginToken);
    this.appStateManage.localStorage.setItem('IsDefaultUser', response.IsDefault.toString());
    this.appStateManage.localStorage.setItem('UserDisplayName', response.UserDisplayName);
    this.appStateManage.localStorage.setItem('SelectedCompanyRef', response.LastSelectedCompanyRef.toString());
    this.appStateManage.localStorage.setItem('companyName', response.CompanyName);
    this.appStateManage.localStorage.setItem('userEmail', response.EMailId);
    this.appStateManage.localStorage.setItem('LoginEmployeeRef', response.LoginEmployeeRef.toString());

    this.isLoggingIn = false;
    this.toastService.present('Logged in successfully', 2000, 'success');
    this.loginForm.reset();

    if (response.LoginForFirstTime == 0) {
      this.router.navigate(['/mobile-app/auth/create-new-password']);
    } else {
      this.router.navigate(['/mobile-app/tabs']);
    }
    await this.haptic.success();
  };

  goToForgotPassword = async () => {
    await this.router.navigate(['mobile-app/auth/forgot-password'], { replaceUrl: true });
    await this.haptic.selectionChanged();
  };
}
