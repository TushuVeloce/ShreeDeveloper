import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-enquiry-details',
  templateUrl: './customer-enquiry-details.component.html',
  styleUrls: ['./customer-enquiry-details.component.scss'],
  standalone:false
})
export class CustomerEnquiryDetailsComponent  implements OnInit {
  DesignationList =[]
  Plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area in sqm', 'Area in Sqft', 'Customer Status', 'Remark'];


  constructor() { }

  ngOnInit() {}

}
