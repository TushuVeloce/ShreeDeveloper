import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'


@Component({
  selector: 'app-vendor-master-details',
  standalone:false,
  templateUrl: './vendor-master-details.component.html',
  styleUrls: ['./vendor-master-details.component.scss'],
})
export class VendorMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  BackVendor(){
    this.router.navigate(['/homepage/Website/Vendor_Master']);
   }

}
