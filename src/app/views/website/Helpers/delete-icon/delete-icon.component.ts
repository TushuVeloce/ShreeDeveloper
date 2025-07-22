import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'Delete-Icon',
  standalone: false,
  template: `
  <span style="margin-left: 5px; cursor: pointer;" (click)="onDeleteClicked()">
  <img src="/assets/icons/delete.png" alt="Delete" title="Delete" width="20px" height="20px" />
</span>
  `,
  styles: ``,
})
export class DeleteIconComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Output() deleteClicked: EventEmitter<void> = new EventEmitter<void>();

  onDeleteClicked() {
    this.deleteClicked.emit();
  }
}
