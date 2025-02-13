import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Marketing } from 'src/app/classes/domain/entities/website/masters/marketing/marketing';

@Component({
  selector: 'app-marketing-master-details',
  standalone: false,
  templateUrl: './marketing-master-details.component.html',
  styleUrls: ['./marketing-master-details.component.scss'],
})
export class MarketingMasterDetailsComponent implements OnInit {
  Entity: Marketing = Marketing.CreateNewInstance();
  MarketingModesList = DomainEnums.MarketingModesList();

  constructor(private router: Router) {}

  ngOnInit() {}

  BackMarketing() {
    this.router.navigate(['/homepage/Website/Marketing_Master']);
  }
}
