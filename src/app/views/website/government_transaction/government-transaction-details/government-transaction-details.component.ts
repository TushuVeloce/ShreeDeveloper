import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-government-transaction-details',
  templateUrl: './government-transaction-details.component.html',
  styleUrls: ['./government-transaction-details.component.scss'],
  standalone: false,

})
export class GovernmentTransactionDetailsComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() { }

  getSiteWorkGroupName = async (SiteWorkGroupName: string) => {
    await this.router.navigate(['/homepage/Website/Respected_child', { queryParams: SiteWorkGroupName }]);
  }
}
