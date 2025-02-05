import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-bottomsheet-dropdown',
  templateUrl: './mobile-bottomsheet-dropdown.component.html',
  styleUrls: ['./mobile-bottomsheet-dropdown.component.scss'],
  standalone:false,
})
export class MobileBottomsheetDropdownComponent  implements OnInit {
  @Input() items: string[] = [];
  @Output() selectItem = new EventEmitter<string>();

  select(value: string) {
    this.selectItem.emit(value);
  }
  constructor() { }

  ngOnInit() {}

}
