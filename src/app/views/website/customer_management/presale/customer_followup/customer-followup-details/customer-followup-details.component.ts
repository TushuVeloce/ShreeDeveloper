import { Component, OnInit } from '@angular/core';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';

@Component({
  selector: 'app-customer-followup-details',
  templateUrl: './customer-followup-details.component.html',
  styleUrls: ['./customer-followup-details.component.scss'],
  standalone: false,
})
export class CustomerFollowupDetailsComponent  implements OnInit {
  Plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area in sqm', 'Area in Sqft', 'Customer Status', 'Remark'];
  ContractModesList = DomainEnums.MarketingModesList(true, '--Select Modes Type--');
  
  constructor() { }

  ngOnInit() {}

}
