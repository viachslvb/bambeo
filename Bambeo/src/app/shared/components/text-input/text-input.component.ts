import { Component, Input, OnInit, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

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

  errorMessages = [
    { key: 'required', message: 'To pole nie może być puste' },
    { key: 'email', message: 'Nieprawidłowy adres e-mail' },
    { key: 'pattern', message: 'Hasło musi mieć od 8 do 16 znaków, zawierać przynajmniej jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny' },
    { key: 'emailExists', message: 'Adres e-mail jest już używany' },
    { key: 'passwordMismatch', message: 'Wprowadzone hasła nie są identyczne' },
    { key: 'whitespaces', message: 'To pole nie może być puste lub zawierać tylko białe znaki' }
  ];

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

  isErrorVisible(control: AbstractControl, errorKey: string): boolean {
    return (control.touched || control.dirty) && control.errors?.[errorKey];
  }

  togglePasswordVisibility() {
    this.isVisiblePassword = !this.isVisiblePassword;
  }
}