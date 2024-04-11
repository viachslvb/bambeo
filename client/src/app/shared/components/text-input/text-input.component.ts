import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'bb-text-input',
  templateUrl: './text-input.component.html'
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @Input() type = 'text';
  @Input() label = '';
  @Input() name = '';
  @Input() placeholder = '';
  isPasswordType: boolean = false;
  isVisiblePassword: boolean = false;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.type === 'password') {
      this.isPasswordType = true;
    }
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  get control(): FormControl {
    return this.controlDir.control as FormControl
  }

  togglePasswordVisibility() {
    this.isVisiblePassword = !this.isVisiblePassword;
  }
}