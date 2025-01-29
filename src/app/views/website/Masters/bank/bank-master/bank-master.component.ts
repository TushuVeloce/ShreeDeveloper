import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-master',
  standalone: false,
  templateUrl: './bank-master.component.html',
  styleUrls: ['./bank-master.component.scss'],
})
export class BankMasterComponent  implements OnInit {
headers: string[] = ['Sr.No.','Bank Name','Branch Name','Account No','IFSC Code','Opening Balance','Action'];

constructor( private router:Router) { }

  ngOnInit() {}

  AddBank(){
    this.router.navigate(['/homepage/Website/Bank_Master_Details']);
   }

}
