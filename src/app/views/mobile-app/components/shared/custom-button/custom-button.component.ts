import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  standalone:false
})
export class CustomButtonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  @Input() label!: string;
  @Input() type: 'submit' | 'button' = 'button';
  @Input() expand: 'full' | 'block' | 'default' = 'block';
  @Input() color: string = 'primary';
  @Input() fill: 'clear' | 'outline' | 'solid' | 'default' = 'solid';
  @Input() shape: 'round' | 'square' | 'default' = 'default';
  @Input() icon?: string;
  @Input() iconPosition: 'start' | 'end' = 'start';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() customClass?: string;
  @Input() customStyle?: { [key: string]: any };

}

// <app-custom-button
// label = "Login"
// type = "submit"
// [loading] = "isLoggingIn"
// icon = "log-in"
// iconPosition = "end"
// color = "success"
// shape = "round"
// fill = "solid"
// [disabled] = "!form.valid"
// customClass = "my-btn"
// [customStyle] = "{ 'margin-top': '20px' }"
// > </app-custom-button>
