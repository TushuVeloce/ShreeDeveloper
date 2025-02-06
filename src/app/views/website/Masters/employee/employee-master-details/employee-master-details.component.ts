import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-master-details',
  standalone: false,
  templateUrl: './employee-master-details.component.html',
  styleUrls: ['./employee-master-details.component.scss'],
})
export class EmployeeMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  RoleRef: number = 0;
  RoleList: string[] = ['XYZ'];
  getRoleRef(Ref:any) {
  }

  GenderRef: number = 0;
  GenderList: string[] = ['Male','Female'];
  getGenderRef(Ref:any) {
  }

  LoginStatusRef: number = 0;
  LoginStatusList: string[] = ['Enable','Disable'];
  getLoginStatusRef(Ref:any) {
  }

  DepartmentRef: number = 0;
  DepartmentList: string[] = ['ABC'];
  getDepartmentRef(Ref:any) {
  }


  BackEmployee(){
    this.router.navigate(['/homepage/Website/Employee_Master']);
   }

}
