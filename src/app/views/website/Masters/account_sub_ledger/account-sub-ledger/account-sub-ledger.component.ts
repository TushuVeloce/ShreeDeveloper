import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-sub-ledger',
  standalone: false,
  templateUrl: './account-sub-ledger.component.html',
  styleUrls: ['./account-sub-ledger.component.scss'],
})
export class AccountSubLedgerComponent  implements OnInit {

  headers: string[] = ['Sr.No.','Under Main Ledger','Sub Ledger','Description','Action'];

  constructor() { }

  ngOnInit() {}

}
