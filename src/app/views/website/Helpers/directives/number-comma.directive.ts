import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[appCommaNumber]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CommaNumberDirective),
    multi: true
  }]
})
export class CommaNumberDirective implements ControlValueAccessor {

  private onChange = (_: any) => {};
  private onTouched = () => {};
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  writeValue(value: any): void {
    const formatted = this.formatWithCommas(value);
    this.el.value = formatted;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = this.el;
    const cursorPosition = input.selectionStart ?? 0;
    const rawValue = input.value.replace(/,/g, '');

    // Early return if invalid characters
    if (!/^\d*$/.test(rawValue)) return;

    const formatted = this.formatWithCommas(rawValue);
    const diff = formatted.length - input.value.length;

    input.value = formatted;
    const newCursor = cursorPosition + diff;
    input.setSelectionRange(newCursor, newCursor);

    const numericValue = parseFloat(rawValue);
    this.onChange(!isNaN(numericValue) ? numericValue : null);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private formatWithCommas(value: number | string): string {
    if (!value) return '';
    const str = value.toString();
    const parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
