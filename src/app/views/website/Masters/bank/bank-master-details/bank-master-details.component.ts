import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-master-details',
  standalone: false,
  templateUrl: './bank-master-details.component.html',
  styleUrls: ['./bank-master-details.component.scss'],
})
export class BankMasterDetailsComponent  implements OnInit {

  constructor( private router:Router) { }

  ngOnInit() {}

  BackBank(){
    this.router.navigate(['/homepage/Website/Bank_Master']);
   }

}
