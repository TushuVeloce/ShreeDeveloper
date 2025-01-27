import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-master',
  standalone: false,
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.scss'],
})
export class MaterialMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Material Name','Material Unit','Action'];
  constructor() { }

  ngOnInit() {}

}
