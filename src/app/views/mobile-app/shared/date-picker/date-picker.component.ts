import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: false,
})
export class DatePickerComponent  implements OnInit {
  @Input() show = false;
  @Input() selectedDate: string = '';
  @Input() defaultToday: boolean = false;
  @Input() maxDate: string = '2030-12-31';
  @Input() minDate: string = '2000-01-01';

  @Output() dateSelected = new EventEmitter<string>();  // Fires on "Set"
  @Output() dateChanged = new EventEmitter<string>();   // Fires on change
  @Output() modalDismissed = new EventEmitter<void>();  // Fires on "Cancel"

  ngOnInit() {
    this.initializeDate();
  }

  ngOnChanges(changes: any) {
    if (changes['show'] && this.show) {
      this.initializeDate(); // Re-initialize when modal opens
    }
  }

  initializeDate() {
    if (!this.selectedDate && this.defaultToday) {
      this.selectedDate = new Date().toISOString().split('T')[0];
    }
  }

  onCancel() {
    this.modalDismissed.emit();
  }

  onSet() {
    const formatted = new Date(this.selectedDate).toISOString().split('T')[0];
    this.dateSelected.emit(formatted);
  }

  onChange(event: any) {
    const newDate = event.detail?.value || this.selectedDate;
    this.selectedDate = newDate;
    this.dateChanged.emit(newDate); // Emit ISO string
  }
}
