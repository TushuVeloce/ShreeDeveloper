import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-master',
  standalone: false,
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss'],
})
export class EmployeeMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Role','First Name','Last Name','Email ID','Contact No',' Address',' Gender','Emp Id ','Department Name','Login Status ','Is User ','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

  AddEmployee(){
    this.router.navigate(['/homepage/Website/Employee_Master_Details']);
   }

}
