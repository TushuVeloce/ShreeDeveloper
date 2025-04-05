import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-sub-ledger',
  standalone: false,
  templateUrl: './account-sub-ledger.component.html',
  styleUrls: ['./account-sub-ledger.component.scss'],
})
export class AccountSubLedgerComponent  implements OnInit {

  headers: string[] = ['Sr.No.','Under Main Ledger','Sub Ledger','Description','Action'];

  constructor( private router:Router) { }

  ngOnInit() {}

  AddSubLedger = () => {
    this.router.navigate(['/homepage/Website/Account_Sub_Ledger_Details']);
   }

}
