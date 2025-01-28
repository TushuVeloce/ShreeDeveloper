import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-management-master',
  templateUrl: './site-management-master.component.html',
  styleUrls: ['./site-management-master.component.scss'],
  standalone: false,
})
export class SiteManagementMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Site Name','Supervisor Name','Actual stage','Action'];
  constructor() { }

  ngOnInit() {}

}
