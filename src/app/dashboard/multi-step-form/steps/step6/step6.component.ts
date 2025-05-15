import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-step6',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step6.component.html',
  styleUrl: './step6.component.css'
})
export class Step6Component implements OnInit {
  @Input() parentForm!: FormGroup;

  relationshipOptions: string[] = [];
  substanceOptions: string[] = [];

  ngOnInit() {
    this.setupValidation();
  }

  get deathsForm(): FormGroup {
    return this.parentForm.get('spaDeaths') as FormGroup;
  }

  private setupValidation() {
    // Set required validator for number of deaths
    this.deathsForm.get('nbDeathCauseBySpaInEntourage')?.setValidators([Validators.required]);
    this.deathsForm.get('nbDeathCauseBySpaInEntourage')?.updateValueAndValidity();

    // Add validation for death cause details
    this.deathsForm.get('nbDeathCauseBySpaInEntourage')?.valueChanges.subscribe(value => {
      const deathCauseControl = this.deathsForm.get('deathCauseBySpaInEntourage');
      if (value && value > 0) {
        deathCauseControl?.setValidators([Validators.required]);
      } else {
        deathCauseControl?.clearValidators();
        deathCauseControl?.setValue('');
      }
      deathCauseControl?.updateValueAndValidity();
    });
  }
}
