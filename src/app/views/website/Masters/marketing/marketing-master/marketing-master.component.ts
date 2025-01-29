import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketing-master',
  standalone: false,
  templateUrl: './marketing-master.component.html',
  styleUrls: ['./marketing-master.component.scss'],
})
export class MarketingMasterComponent  implements OnInit {

  headers: string[] = ['Sr.No.','Marketing Type','Description','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

  AddMarketing(){
    this.router.navigate(['/homepage/Website/Marketing_Master_Details']);
   }

}
