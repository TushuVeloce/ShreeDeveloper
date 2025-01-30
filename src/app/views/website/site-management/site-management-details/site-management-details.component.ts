import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-management-details',
  templateUrl: './site-management-details.component.html',
  styleUrls: ['./site-management-details.component.scss'],
})
export class SiteManagementDetailsComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  BackSiteManagement() {
    this.router.navigate(['/homepage/Website/site_management_Master']);
  }

}
