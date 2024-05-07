import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && (control.value || '').trim().length === 0) {
      return { 'whitespaces': true };
    }
    return null;
  };
}