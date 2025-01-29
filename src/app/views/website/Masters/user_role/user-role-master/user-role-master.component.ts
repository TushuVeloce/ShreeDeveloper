import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-role-master',
  standalone: false,
  templateUrl: './user-role-master.component.html',
  styleUrls: ['./user-role-master.component.scss'],
})
export class UserRoleMasterComponent  implements OnInit {

  headers: string[] = ['Sr.No.','Role','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

  AddUserRole(){
    this.router.navigate(['/homepage/Website/User_Role_Master_Details']);
   }

}
