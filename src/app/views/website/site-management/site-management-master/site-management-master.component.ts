import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-management-master',
  templateUrl: './site-management-master.component.html',
  styleUrls: ['./site-management-master.component.scss'],
  standalone: false,
})
export class SiteManagementMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Site Name','Supervisor Name','Actual stage','Action'];
  constructor(private router: Router) { }

  ngOnInit() {}

  AddSite = async () => {
    await this.router.navigate(['/homepage/Website/Site_Management_Details']);
  }

}
