import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-main-ledger',
  standalone: false,
  templateUrl: './account-main-ledger.component.html',
  styleUrls: ['./account-main-ledger.component.scss'],
})
export class AccountMainLedgerComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Main Ledger','Type','Description','Action'];

  constructor() { }

  ngOnInit() {}

}
