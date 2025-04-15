import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  standalone:false
})
export class CardListComponent  implements OnInit {
  @Input() cardListData: any;
  constructor() { }

  ngOnInit() {}
}
