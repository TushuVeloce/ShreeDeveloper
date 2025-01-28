import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-master',
  standalone:false,
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.scss'],
})
export class VendorMasterComponent  implements OnInit {
  headers: string[] = ['ID','Vendor Name','Vendor Phone No','Address','Material Name','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

 AddVendor(){
   this.router.navigate(['/homepage/Website/Vendor_Master_Details']);
  }

}
