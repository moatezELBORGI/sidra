import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step5.component.html',
  styleUrl: './step5.component.css'
})
export class Step5Component implements OnInit {
  @Input() parentForm!: FormGroup;

  ngOnInit() {
    this.setupValidation();
  }

  get comorbiditiesForm(): FormGroup {
    return this.parentForm.get('comorbidities') as FormGroup;
  }

  private setupValidation() {
    // Personal psychiatric comorbidity validation
    this.comorbiditiesForm.get('hasPersonalPsychiatricComorbidity')?.valueChanges.subscribe(value => {
      const detailsControl = this.comorbiditiesForm.get('personalPsychiatricComorbidityDetails');
      if (value === true) {
        detailsControl?.setValidators([Validators.required]);
      } else {
        detailsControl?.clearValidators();
        detailsControl?.setValue('');
      }
      detailsControl?.updateValueAndValidity();
    });

    // Personal somatic comorbidity validation
    this.comorbiditiesForm.get('hasPersonalSomaticComorbidity')?.valueChanges.subscribe(value => {
      const detailsControl = this.comorbiditiesForm.get('personalSomaticComorbidityDetails');
      if (value === true) {
        detailsControl?.setValidators([Validators.required]);
      } else {
        detailsControl?.clearValidators();
        detailsControl?.setValue('');
      }
      detailsControl?.updateValueAndValidity();
    });

    // Partner psychiatric comorbidity validation
    this.comorbiditiesForm.get('hasPartnerPsychiatricComorbidity')?.valueChanges.subscribe(value => {
      const detailsControl = this.comorbiditiesForm.get('partnerPsychiatricComorbidityDetails');
      if (value === true) {
        detailsControl?.setValidators([Validators.required]);
      } else {
        detailsControl?.clearValidators();
        detailsControl?.setValue('');
      }
      detailsControl?.updateValueAndValidity();
    });

    // Partner somatic comorbidity validation
    this.comorbiditiesForm.get('hasPartnerSomaticComorbidity')?.valueChanges.subscribe(value => {
      const detailsControl = this.comorbiditiesForm.get('partnerSomaticComorbidityDetails');
      if (value === true) {
        detailsControl?.setValidators([Validators.required]);
      } else {
        detailsControl?.clearValidators();
        detailsControl?.setValue('');
      }
      detailsControl?.updateValueAndValidity();
    });

    // Set required validators for all main fields
    this.comorbiditiesForm.get('hasPersonalPsychiatricComorbidity')?.setValidators([Validators.required]);
    this.comorbiditiesForm.get('hasPersonalSomaticComorbidity')?.setValidators([Validators.required]);
    this.comorbiditiesForm.get('hasPartnerPsychiatricComorbidity')?.setValidators([Validators.required]);
    this.comorbiditiesForm.get('hasPartnerSomaticComorbidity')?.setValidators([Validators.required]);

    // Update validity
    this.comorbiditiesForm.get('hasPersonalPsychiatricComorbidity')?.updateValueAndValidity();
    this.comorbiditiesForm.get('hasPersonalSomaticComorbidity')?.updateValueAndValidity();
    this.comorbiditiesForm.get('hasPartnerPsychiatricComorbidity')?.updateValueAndValidity();
    this.comorbiditiesForm.get('hasPartnerSomaticComorbidity')?.updateValueAndValidity();
  }
}
