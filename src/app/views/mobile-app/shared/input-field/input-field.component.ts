import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() iconSlot?: string='start';
  @Input() formGroup!: FormGroup;
  @Input() placeholder: string = '';
  @Input() maxlength: number | null = null;
  @Input() minlength: number | null = null;
  @Input() pattern: string | RegExp  = '';
  @Input() readonly: boolean = false;
  @Input() clearInput: boolean = false;
  @Input() buttonType: boolean = false;
  @Input() customClass?: string;
  @Input() customStyle?: { [key: string]: any };
  @Output() fieldClick = new EventEmitter<void>();

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

  // onFieldClick() {
  //   debugger
  //   if (this.readonly && this.buttonType) {
  //     this.fieldClick.emit();
  //   }
  // }
  private isClickHandling = false;

  onFieldClick() {
    if (this.readonly && this.buttonType) {
      if (this.isClickHandling) return; // Ignore if already handling
      this.isClickHandling = true;
      this.fieldClick.emit();
      setTimeout(() => {
        this.isClickHandling = false; // Reset after 300ms (adjust as needed)
      }, 300);
    }
  }
}
