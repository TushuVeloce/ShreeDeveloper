import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'Edit-Icon',
  standalone: false,
  template: `
  <span style="margin-left: 5px; cursor: pointer;" (click)="onEditClick()"  >
  <img src="/assets/icons/edit.png"  alt="Edit icon" title="Edit" width="20px" height="20px">
</span>
  `,
  styles: ``,
})
export class EditIconComponent implements OnInit {

  @Output() editClick = new EventEmitter<void>();

  constructor(public themeService: ThemeService) { }

  onEditClick() {
    this.editClick.emit();
  }
  ngOnInit() { }

}
