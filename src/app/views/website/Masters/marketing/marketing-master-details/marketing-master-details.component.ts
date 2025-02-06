import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketing-master-details',
  standalone: false,
  templateUrl: './marketing-master-details.component.html',
  styleUrls: ['./marketing-master-details.component.scss'],
})
export class MarketingMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  MarketingTypeRef: number = 0;
  MarketingTypeList: string[] = ['Digital'];
  getMarketingTypeRef(Ref:any) {
  }

  BackMarketing(){
    this.router.navigate(['/homepage/Website/Marketing_Master']);
   }

}
