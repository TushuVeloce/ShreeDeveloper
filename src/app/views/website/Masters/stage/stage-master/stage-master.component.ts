import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stage-master',
  standalone: false,
  templateUrl: './stage-master.component.html',
  styleUrls: ['./stage-master.component.scss'],
})
export class StageMasterComponent  implements OnInit {
  headers: string[] = ['Stage.No.','Stage Name'];

  constructor() { }

  ngOnInit() {}

}
