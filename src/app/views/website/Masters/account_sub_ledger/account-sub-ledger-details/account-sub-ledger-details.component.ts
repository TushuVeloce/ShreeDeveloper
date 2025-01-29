import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-sub-ledger-details',
  standalone: false,
  templateUrl: './account-sub-ledger-details.component.html',
  styleUrls: ['./account-sub-ledger-details.component.scss'],
})
export class AccountSubLedgerDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  BackSubLedger(){
    this.router.navigate(['/homepage/Website/Account_Sub_Ledger']);
   }


}
