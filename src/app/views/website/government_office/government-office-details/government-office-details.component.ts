import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-government-office-details',
  templateUrl: './government-office-details.component.html',
  styleUrls: ['./government-office-details.component.scss'],
  standalone: false,

})
export class GovernmentOfficeDetailsComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() { }

  getSiteWorkGroupName = async (SiteWorkGroupName: string) => {
    await this.router.navigate(['/homepage/Website/Respected_child', { queryParams: SiteWorkGroupName }]);
  }
}
