import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: false,
})
export class DatePickerComponent  implements OnInit {
  @Input() show = false;
  @Input() selectedDate: string = '';
  @Input() defaultToday = false;
  @Input() maxDate = '2030-12-31';
  @Input() minDate = '2000-01-01';

  @Output() dateSelected = new EventEmitter<string>();
  @Output() dateChanged = new EventEmitter<string>();
  @Output() modalDismissed = new EventEmitter<void>();

  tempDate: string = '';

  ngOnInit(): void {
    this.initializeDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.initializeDate();
    }
  }

  private initializeDate(): void {
    const initial = this.selectedDate || (this.defaultToday ? this.formatDate(new Date()) : '');
    this.tempDate = initial;
  }

  onCancel(): void {
    this.modalDismissed.emit();
  }

  onSet(): void {
    this.selectedDate = this.tempDate || this.formatDate(new Date());
    this.dateSelected.emit(this.selectedDate);
    this.dateChanged.emit(this.selectedDate); // Optional: emit on Set as well
  }

  onChange(event: any): void {
    const newDate = event.detail?.value || this.tempDate;
    this.tempDate = newDate;
    // Do not emit here, wait until onSet
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
