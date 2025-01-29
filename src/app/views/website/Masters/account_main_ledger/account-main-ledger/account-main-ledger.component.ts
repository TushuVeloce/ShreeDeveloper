import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-main-ledger',
  standalone: false,
  templateUrl: './account-main-ledger.component.html',
  styleUrls: ['./account-main-ledger.component.scss'],
})
export class AccountMainLedgerComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Main Ledger','Type','Description','Action'];
  constructor( private router:Router) { }

  ngOnInit() {}
  AddMainLedger(){
    this.router.navigate(['/homepage/Website/Account_Main_Ledger_Details']);
   }
}
