import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  standalone:false
})
export class DateFieldComponent  implements OnInit {

  @Input() label!: string;
  @Input() controlName!: string;
  @Input() formGroup!: FormGroup;

  @Input() min?: string;
  @Input() max?: string;
  @Input() displayFormat: string = 'MMM d, yyyy';
  @Input() placeholder: string = 'Select a date';
  @Input() presentation: 'date' | 'time' | 'date-time' = 'date';
  @Input() readonly: boolean = false;

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }
  constructor() { }

  ngOnInit() {}

}


// <app-date-field label = "Date of Birth" controlName = "DOB"[formGroup] = "employeeForm"[min] = "'1990-01-01'"
// [max] = "'2025-12-31'" displayFormat = "dd MMM yyyy" placeholder = "Choose your birthdate" presentation = "date" >
//   </app-date-field>