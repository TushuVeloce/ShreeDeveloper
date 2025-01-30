import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-master-details',
  standalone: false,
  templateUrl: './user-master-details.component.html',
  styleUrls: ['./user-master-details.component.scss'],
})
export class UserMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  BackUser(){
    this.router.navigate(['/homepage/Website/User_Master']);
   }

}
