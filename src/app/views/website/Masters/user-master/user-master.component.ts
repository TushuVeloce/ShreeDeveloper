import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-master',
  standalone: false,
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss'],
})
export class UserMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','User Name','Email Id','Mobile No','Role','Action'];

  constructor() { }

  ngOnInit() {}

}
