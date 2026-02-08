import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

//login.validator.ts
export function restrictedWordsValidator(words: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isRestricted = words.includes(control.value?.toLowerCase());
    return isRestricted ? { restrictedWord: true } : null;
  };
}