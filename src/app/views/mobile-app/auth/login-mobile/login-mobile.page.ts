// login-mobile.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../core/toast.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UserLoginRequest } from 'src/app/classes/infrastructure/request_response/userloginrequest';
import { HapticService } from '../../core/haptic.service';

@Component({
  selector: 'app-login-mobile',
  templateUrl: './login-mobile.page.html',
  styleUrls: ['./login-mobile.page.scss'],
  standalone:false
})
export class LoginMobilePage implements OnInit {
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
      this.toastService.present(response.Message, 2000, 'danger');
      await this.haptic.error();
      this.isLoggingIn = false;
      return;
    }

    // Store session values
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

    this.toastService.present('Logged in successfully', 2000, 'success');
    this.isLoggingIn = false;
    this.loginForm.reset();

    if (response.LoginForFirstTime == 0) {
      this.router.navigate(['/mobileapp/auth/create-new-password-mobile']);
    } else {
      this.router.navigate(['/mobileapp/tabs/dashboard']);
    }

    await this.haptic.success();
  };

  goToForgotPassword = async () => {
    await this.router.navigate(['mobileapp/auth/forgot-password-mobile'], { replaceUrl: true });
    await this.haptic.selectionChanged();
  };
}
