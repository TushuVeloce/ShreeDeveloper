import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraetePasswordCustomRequest } from 'src/app/classes/domain/entities/website/create_password/createpasswordcustomrequest';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-create-password-mobile-app',
  templateUrl: './create-password-mobile-app.component.html',
  styleUrls: ['./create-password-mobile-app.component.scss'],
  standalone: false
})
export class CreatePasswordMobileAppComponent implements OnInit {
  passwordForm: FormGroup;
  showOld = false;
  showNew = false;
  showConfirm = false;
  OldPassword: string = '';
  NewPassword: string = '';
  ConfirmPassword: string = '';
  EmployeeRef: number = 0;
  CompanyRef: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private uiUtils: UIUtils, private payloadPacketFacade: PayloadPacketFacade, private serverCommunicator: ServerCommunicatorService, private appStateManage: AppStateManageService) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.CompanyRef = Number(this.appStateManage.StorageKey.getItem('SelectedCompanyRef'))
  }

  isInvalid(controlName: string): boolean {
    const control = this.passwordForm.get(controlName);
    return control?.touched && control?.invalid ? control?.touched && control?.invalid : false;
  }

  onChangePassword = async () => {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;
    console.log('this.passwordForm.value :', this.passwordForm.value);

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    this.OldPassword = this.passwordForm.value.oldPassword;
    this.NewPassword = this.passwordForm.value.newPassword;
    this.ConfirmPassword = this.passwordForm.value.confirmPassword;
    let req = new CraetePasswordCustomRequest();
    req.CompanyRef = this.CompanyRef
    req.EmployeeRef = this.EmployeeRef
    req.OldPassword = this.OldPassword;
    req.NewPassword = this.NewPassword;
    req.ConfirmPassword = this.ConfirmPassword;
    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }

    await this.uiUtils.showSuccessToster('Password Created Successfully');
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    await this.router.navigate(['/login_mobile_app']);
  };
}

