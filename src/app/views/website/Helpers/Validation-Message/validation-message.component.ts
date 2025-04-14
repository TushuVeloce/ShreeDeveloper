import { Component, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidationMessages } from 'src/app/classes/domain/constants';

@Component({
  selector: 'validation',
  standalone: false ,
  template: `
  
  <div style="height: 25px;">
    <div *ngIf="control?.invalid && (control.touched || control.dirty)">
      <span class="validation-text" *ngIf="control.errors?.['pattern']">
        {{ patternMessage }}
      </span>

      <span
        class="validation-text"
        *ngIf="showRequired && control.errors?.['required']"
      >
        {{ requiredMessage }}
      </span>
    </div>
    </div>

  `,
})
export class ValidationMessageComponent {
  @Input() control!: NgModel;

  // Show/hide required error (defaults to true)
  @Input() showRequired: boolean = true;         // Note: If we don't want RequiredFieldMsg then we have to pass [showRequired]="false" 
   
  // Optional messages
  @Input() requiredMessage: string = ValidationMessages.RequiredFieldMsg;
  @Input() patternMessage: string = '';
}