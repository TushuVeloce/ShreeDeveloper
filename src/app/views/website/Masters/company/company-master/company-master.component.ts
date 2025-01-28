import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-master',
  standalone: false,
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.scss'],
})
export class CompanyMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Name','Owner Name','Contact','Address','Registration Number',' GST No',' Pan No','Bank Name','Bank Branch','Account No','IFSC Code','CIN No','Action'];

  constructor() { }

  ngOnInit() {}

}
