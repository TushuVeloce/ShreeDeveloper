import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HapticService } from '../../core/haptic.service';


@Component({
  selector: 'app-chip-selector',
  templateUrl: './chip-selector.component.html',
  styleUrls: ['./chip-selector.component.scss'],
  standalone: false,
})
export class ChipSelectorComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() selected: number[] = [];           // pre-selected by Ref
  @Input() disabledItems: number[] = [];      // disable by Ref
  @Input() maxSelection: number = 3;
  @Input() showClear: boolean = false;
  @Input() label: string = 'Select Items';
  @Input() singleSelection: boolean = false;

  @Output() selectedChanged = new EventEmitter<any[]>();         // Emits full object
  @Output() validationError = new EventEmitter<string>();

  ngOnInit(): void {
    this.items.forEach(item => {
      item.selected = this.selected.includes(item.Ref);
      item.disabled = this.disabledItems.includes(item.Ref);
    });
  }
  constructor(
    private haptic: HapticService,
  ) { }

  toggleItem(item: any) {
    if (item.disabled) return;
    if (this.singleSelection) {
      this.items.forEach(i => (i.selected = false));
      item.selected = true;
    } else {
    if (item.selected) {
      item.selected = false;
    } else {
      const selectedCount = this.items.filter(i => i.selected).length;
      this.haptic.mediumImpact();
      if (selectedCount >= this.maxSelection) {
        this.validationError.emit(`You can only select up to ${this.maxSelection} items.`);
        this.haptic.warning();
        return;
      }
      item.selected = true;
    }
  }

    this.emitSelected();
  }

  clearAll() {
    this.items.forEach(i => {
      if (!i.disabled) i.selected = false;
    });
    this.haptic.mediumImpact();
    this.emitSelected();
  }

  emitSelected() {
    const selected = this.items.filter(i => i.selected);
    this.selectedChanged.emit(selected); // 🔁 Emit full selected objects
  }
}
