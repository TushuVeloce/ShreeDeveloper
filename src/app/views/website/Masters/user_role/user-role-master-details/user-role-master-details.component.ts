import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-role-master-details',
  standalone: false,
  templateUrl: './user-role-master-details.component.html',
  styleUrls: ['./user-role-master-details.component.scss'],
})
export class UserRoleMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  BackUserRole(){
    this.router.navigate(['/homepage/Website/User_Role_Master']);
   }

}
