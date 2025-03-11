import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-management-details',
  standalone: false,
  templateUrl: './site-management-details.component.html',
  styleUrls: ['./site-management-details.component.scss'],
})
export class SiteManagementDetailsComponent  implements OnInit {
  headers: string[] = ['Sr.No.', 'Plot No', 'Area sq.m', 'Area sq.ft', 'Goverment Rate', 'Company Rate', 'Action'];
  
  constructor(private router: Router) { }

  ngOnInit() {}

  BackSiteManagement() {
    this.router.navigate(['/homepage/Website/site_management_Master']);
  }

}
