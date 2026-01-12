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
  standalone: false,
})
export class LoginMobileAppComponent implements OnInit {

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

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoggingIn = true;

    const { email, password } = this.loginForm.value;
    const req = new UserLoginRequest();
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

    // Store login session data
    this.appStateManage.setEmployeeRef(response.LoginEmployeeRef);
    this.appStateManage.setLoginTokenForMobile(response.LoginToken);
    this.companystatemanagement.setCompanyRef(response.LastSelectedCompanyRef, response.CompanyName);

    const storage = this.appStateManage.localStorage;
    storage.setItem('LoginToken', response.LoginToken);
    storage.setItem('IsDefaultUser', response.IsDefault.toString());
    storage.setItem('UserDisplayName', response.UserDisplayName);
    storage.setItem('SelectedCompanyRef', response.LastSelectedCompanyRef.toString());
    storage.setItem('companyName', response.CompanyName);
    storage.setItem('userEmail', response.EMailId);
    storage.setItem('LoginEmployeeRef', response.LoginEmployeeRef.toString());
    storage.setItem('ValidMenu', JSON.stringify(response.ValidMenuItems));

    this.toastService.present('Logged in successfully', 2000, 'success');
    await this.haptic.success();

    this.loginForm.reset();
    this.isLoggingIn = false;

    if (response.LoginForFirstTime === 0) {
      this.router.navigate(['/mobile-app/auth/create-new-password']);
    } else {
      this.router.navigate(['/mobile-app/tabs']);
    }
  }

  async goToForgotPassword() {
    await this.router.navigate(['mobile-app/auth/forgot-password'], { replaceUrl: true });
    await this.haptic.selectionChanged();
  }
}
