import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-master',
  standalone: false,
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss'],
})
export class UserMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Email Id','Contact No','Default Password','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

  AddUser(){
    this.router.navigate(['/homepage/Website/User_Master_Details']);
   }

}
