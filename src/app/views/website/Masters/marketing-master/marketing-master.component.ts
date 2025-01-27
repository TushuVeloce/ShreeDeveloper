import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketing-master',
  standalone: false,
  templateUrl: './marketing-master.component.html',
  styleUrls: ['./marketing-master.component.scss'],
})
export class MarketingMasterComponent  implements OnInit {

  headers: string[] = ['Sr.No.','Marketing Type','Description','Action'];

  constructor() { }

  ngOnInit() {}

}
