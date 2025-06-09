import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  standalone:false
})
export class InputFieldComponent {
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() type: string = 'text';
  @Input() icon?: string;
  @Input() formGroup!: FormGroup;
  @Input() placeholder: string = '';
  @Input() maxlength?: number;
  @Input() pattern?: string | RegExp;
  @Input() readonly: boolean = false;
  @Input() clearInput: boolean = false;
  @Input() customClass?: string;
  @Input() customStyle?: { [key: string]: any };

  showPassword = false;

  get control(): FormControl {
    return this.formGroup?.get(this.controlName) as FormControl;
  }

  get showValidationIcon(): boolean {
    return this.control?.touched || this.control?.dirty;
  }

  get inputType(): string {
    return this.type === 'password'
      ? this.showPassword ? 'text' : 'password'
      : this.type;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
