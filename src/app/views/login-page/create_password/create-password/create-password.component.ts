import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class CreatePasswordComponent  implements OnInit {
  password: string = '';
  confirmpassword: string = '';

  constructor(private router: Router,private uiUtils: UIUtils,) {}

  ngOnInit() {}

  save= async () => {
    if(this.password != this.confirmpassword){
      this.uiUtils.showErrorMessage('Error', 'Password and Confirm Paasword are not same');
      return;
    }
    await this.router.navigate(['/login']); 
  }

}
