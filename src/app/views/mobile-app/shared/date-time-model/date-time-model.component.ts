import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-date-time-model',
  templateUrl: './date-time-model.component.html',
  styleUrls: ['./date-time-model.component.scss'],
  standalone:false
})
export class DateTimeModelComponent  implements OnInit {

  @Input() mode: 'date' | 'time' | 'date-time' = 'date-time';
  @Input() label: string = 'Pick Date/Time';
  @Input() value: string | null = null;

  selectedValue: string | null = null;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.value) {
      this.selectedValue = this.value;
    }
    //  else {
    //   const now = new Date();
    //   this.selectedValue = now.toISOString(); // sets current date-time in ISO format
    // }
    console.log('selectedValue :', this.selectedValue);

  }


  confirm() {
    this.modalCtrl.dismiss(this.selectedValue);
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }
  formatTime(dateString: string | null): string {
    if (!dateString) return '12:00 AM';
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hour12}:${minStr} ${ampm}`;
  }

}
