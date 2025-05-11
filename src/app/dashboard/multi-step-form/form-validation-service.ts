import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormValidationService {

    constructor() {}

    /**
     * Marks all controls in a form group as touched
     * @param formGroup - The form group to touch
     */
    markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    /**
     * Validates all controls in the form and returns whether form is valid
     * @param formGroup - The form group to validate
     */
    validateForm(formGroup: FormGroup): boolean {
        this.markFormGroupTouched(formGroup);
        return formGroup.valid;
    }

    /**
     * Gets form validation error message
     * @param formGroup - The form group to check
     * @param controlName - Control name
     * @returns Error message
     */
    getErrorMessage(formGroup: FormGroup, controlName: string): string {
        const control = formGroup.get(controlName);

        if (!control || !control.errors || !control.touched) {
            return '';
        }

        if (control.errors['required']) {
            return 'Ce champ est obligatoire';
        }

        if (control.errors['email']) {
            return 'Please enter a valid email address';
        }

        if (control.errors['minlength']) {
            return `Ce champ doit contenir au moins ${control.errors['minlength'].requiredLength} caractères`;
        }

        return 'Ce champ est invalide';
    }

    /**
     * Scrolls to the first invalid control in the form
     * @param formId - The ID of the form element
     */
    scrollToFirstInvalidControl(formId: string) {
        setTimeout(() => {
            const firstInvalidControl = document.querySelector(`#${formId} .ng-invalid`);
            if (firstInvalidControl) {
                firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (firstInvalidControl as HTMLElement).focus();
            }
        }, 100);
    }
}
