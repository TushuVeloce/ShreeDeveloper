import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraetePasswordCustomRequest } from 'src/app/classes/domain/entities/website/create_password/createpasswordcustomrequest';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { ToastService } from '../../../core/toast.service';
import { HapticService } from '../../../core/haptic.service';

@Component({
  selector: 'app-create-new-password-mobile-app',
  templateUrl: './create-new-password-mobile-app.component.html',
  styleUrls: ['./create-new-password-mobile-app.component.scss'],
  standalone: false
})
export class CreateNewPasswordMobileAppComponent  implements OnInit {
  passwordForm!: FormGroup;
  isUpdating = false;
  EmployeeRef: number = 0;
  CompanyRef: number = 0;

  constructor(private fb: FormBuilder, 
    private router: Router, 
    private payloadPacketFacade: PayloadPacketFacade, 
    private serverCommunicator: ServerCommunicatorService, 
    private appStateManage: AppStateManageService, 
    private toastService: ToastService,
    private haptic: HapticService,
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: this.matchPasswords });

    this.EmployeeRef = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    this.CompanyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'))

  }
  ionViewWillEnter = async () => {
    this.EmployeeRef = await Number(this.appStateManage.localStorage.getItem('EmployeeRef'))
    this.CompanyRef = await Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'))
  };

  matchPasswords(group: FormGroup) {
    return group.get('newPassword')?.value === group.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onUpdatePassword = async () => {
    if (this.passwordForm.valid) {
      this.isUpdating = true;
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
      let req = new CraetePasswordCustomRequest();
      req.CompanyRef = this.CompanyRef
      req.EmployeeRef = this.EmployeeRef
      req.OldPassword = oldPassword;
      req.NewPassword = newPassword;
      req.ConfirmPassword = confirmPassword;
      let td = req.FormulateTransportData();
      let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
      let tr = await this.serverCommunicator.sendHttpRequest(pkt);
      console.log('tr :', tr);
      if (!tr.Successful) {
        this.toastService.present(tr.Message, 2000, 'danger');
        this.isUpdating = false;
        return;
      }

      this.toastService.present("New Password Created Successfully", 2000, 'success');
      this.haptic.success();
      let tdResult = JSON.parse(tr.Tag) as TransportData;
      this.isUpdating = false;
      this.passwordForm.reset();
      this.router.navigate(['mobile-app/auth/login']);

      // setTimeout(() => {
      //   this.isUpdating = false;
      //   console.log('Password updated successfully');
      //   this.router.navigate(['mobileapp/tabs/dashboard']);
      //   this.toastService.present('Logged in successfully', 2000, 'success');
      // }, 1500);
    }
  }
  goToLogin() {
    this.router.navigate(['mobile-app/auth/login', { replaceUrl: true }]);
  }
}
