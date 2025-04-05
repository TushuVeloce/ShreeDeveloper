import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-main-ledger-details',
  standalone: false,
  templateUrl: './account-main-ledger-details.component.html',
  styleUrls: ['./account-main-ledger-details.component.scss'],
})
export class AccountMainLedgerDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  TypeRef: number = 0;
  TypeList: string[] = ['Expence', 'Income'];
  getTypeRef(Ref:any) {
  }

  BackMainLedger = () => {
    this.router.navigate(['/homepage/Website/Account_Main_Ledger']);
   }

}
