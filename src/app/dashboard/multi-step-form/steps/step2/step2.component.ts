import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DrugRequestService} from "../../../../core/services/drug-request.service";
import {ConsumptionFrequencyDto} from "../../../../core/models/demanddrugs/ConsumptionFrequencyDto.model";

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.css'
})
export class Step2Component implements OnInit {
  @Input() parentForm!: FormGroup;
  isLoading = true;

  constructor(
      private drugRequestService: DrugRequestService,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getConsumptionFrequencyDtoListWithType1();
    this.setupValidation();
    this.restoreFieldVisibility();
  }

  clearDependentFields(form: FormGroup, fieldsToReset: string[]) {
    fieldsToReset.forEach(field => {
      const control = form.get(field);
      if (control) {
        control.reset();
        control.updateValueAndValidity();
      }
    });

    // Clear radio buttons and checkboxes
    const radioButtons = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    [...Array.from(radioButtons), ...Array.from(checkboxes)].forEach(input => {
      if (fieldsToReset.some(field => input.id.includes(field))) {
        input.checked = false;
      }
    });
  }

  handleTobaccoFrequencyChange(event: Event, value: number) {
    const checkbox = event.target as HTMLInputElement;
    const frequencyControl = this.tobaccoForm.get('tobaccoConsumptionFrequencyUuidConsumptionFrequency');

    if (checkbox.checked) {
      // Uncheck all other checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.includes('tobaccoConsumptionFrequencyUuidConsumptionFrequency')) {
          cb.checked = false;
        }
      });
      frequencyControl?.setValue(value);
    } else {
      frequencyControl?.setValue(null);
    }
  }

  handleAlcoholFrequencyChange(event: Event, value: number) {
    const checkbox = event.target as HTMLInputElement;
    const frequencyControl = this.tobaccoForm.get('alcoholConsumptionFrequencyUuidConsumptionFrequency');

    if (checkbox.checked) {
      // Uncheck all other checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.includes('alcoholConsumptionFrequencyUuidConsumptionFrequency')) {
          cb.checked = false;
        }
      });
      frequencyControl?.setValue(value);
    } else {
      frequencyControl?.setValue(null);
    }
  }

  restoreFieldVisibility() {
    const tobaccoForm = this.tobaccoForm;
    const smokingStatus = tobaccoForm.get('tobaccoConsumption')?.value;
    const alcoholStatus = tobaccoForm.get('alcoholConsumption')?.value;

    // Restore tobacco-related fields visibility
    if (smokingStatus === 1 || smokingStatus === 3) {
      this.setupTobaccoValidation(smokingStatus);

      // Restore tobacco consumption within 30 days if smoker
      if (smokingStatus === 1) {
        const consumedWithin30Days = tobaccoForm.get('tobaccoConsumedWithinThirtyDays')?.value;
        if (consumedWithin30Days === true) {
          const frequencyControl = tobaccoForm.get('tobaccoConsumptionFrequencyUuidConsumptionFrequency');
          if (frequencyControl?.value) {
            const checkbox = document.querySelector(`input[id="tobaccoConsumptionFrequencyUuidConsumptionFrequency-${frequencyControl.value}"]`) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = true;
            }
          }
        }
      }
    }

    // Restore alcohol-related fields visibility
    if (alcoholStatus === true) {
      this.setupAlcoholValidation(true);

      const consumedWithin30Days = tobaccoForm.get('alcoholConsumedWithinThirtyDays')?.value;
      if (consumedWithin30Days === true) {
        const frequencyControl = tobaccoForm.get('alcoholConsumptionFrequencyUuidConsumptionFrequency');
        if (frequencyControl?.value) {
          const checkbox = document.querySelector(`input[id="alcoholConsumptionFrequencyUuidConsumptionFrequency-${frequencyControl.value}"]`) as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = true;
          }
        }
      }
    }
  }

  setupValidation() {
    const tobaccoForm = this.tobaccoForm;

    // Tobacco consumption validation
    tobaccoForm.get('tobaccoConsumption')?.valueChanges.subscribe(value => {
      const fieldsToReset = [
        'ageOfTobaccoConsumption',
        'tobaccoConsumedWithinThirtyDays',
        'tobaccoConsumptionFrequencyUuidConsumptionFrequency',
        'ageOfStoppingTobaccoConsumption'
      ];

      if (value !== 1 && value !== 3) {
        this.clearDependentFields(tobaccoForm, fieldsToReset);
      }

      this.setupTobaccoValidation(value);
    });

    // Tobacco consumption within 30 days validation
    tobaccoForm.get('tobaccoConsumedWithinThirtyDays')?.valueChanges.subscribe(value => {
      const frequencyControl = tobaccoForm.get('tobaccoConsumptionFrequencyUuidConsumptionFrequency');

      if (value === true) {
        frequencyControl?.setValidators([Validators.required]);
      } else {
        frequencyControl?.clearValidators();
        this.clearDependentFields(tobaccoForm, ['tobaccoConsumptionFrequencyUuidConsumptionFrequency']);
      }

      frequencyControl?.updateValueAndValidity();
    });

    // Alcohol consumption validation
    tobaccoForm.get('alcoholConsumption')?.valueChanges.subscribe(value => {
      const fieldsToReset = [
        'ageOfAlcoholConsumption',
        'alcoholConsumedWithinThirtyDays',
        'alcoholConsumptionFrequencyUuidConsumptionFrequency'
      ];

      if (value !== true) {
        this.clearDependentFields(tobaccoForm, fieldsToReset);
      }

      this.setupAlcoholValidation(value);
    });

    // Alcohol consumption within 30 days validation
    tobaccoForm.get('alcoholConsumedWithinThirtyDays')?.valueChanges.subscribe(value => {
      const frequencyControl = tobaccoForm.get('alcoholConsumptionFrequencyUuidConsumptionFrequency');

      if (value === true) {
        frequencyControl?.setValidators([Validators.required]);
      } else {
        frequencyControl?.clearValidators();
        this.clearDependentFields(tobaccoForm, ['alcoholConsumptionFrequencyUuidConsumptionFrequency']);
      }

      frequencyControl?.updateValueAndValidity();
    });
  }

  setupTobaccoValidation(value: number) {
    const tobaccoForm = this.tobaccoForm;
    const ageControl = tobaccoForm.get('ageOfTobaccoConsumption');
    const consumedControl = tobaccoForm.get('tobaccoConsumedWithinThirtyDays');
    const frequencyControl = tobaccoForm.get('tobaccoConsumptionFrequencyUuidConsumptionFrequency');
    const stoppingAgeControl = tobaccoForm.get('ageOfStoppingTobaccoConsumption');

    // Clear all validators first
    ageControl?.clearValidators();
    consumedControl?.clearValidators();
    frequencyControl?.clearValidators();
    stoppingAgeControl?.clearValidators();

    if (value === 1 || value === 3) { // Smoker or Ex-smoker
      ageControl?.setValidators([Validators.required]);
    }

    if (value === 1) { // Current smoker
      consumedControl?.setValidators([Validators.required]);
      if (consumedControl?.value === true) {
        frequencyControl?.setValidators([Validators.required]);
      }
    }

    if (value === 3) { // Ex-smoker
      stoppingAgeControl?.setValidators([Validators.required]);
    }

    // Update validity
    ageControl?.updateValueAndValidity();
    consumedControl?.updateValueAndValidity();
    frequencyControl?.updateValueAndValidity();
    stoppingAgeControl?.updateValueAndValidity();
  }

  setupAlcoholValidation(value: boolean) {
    const tobaccoForm = this.tobaccoForm;
    const ageControl = tobaccoForm.get('ageOfAlcoholConsumption');
    const consumedControl = tobaccoForm.get('alcoholConsumedWithinThirtyDays');
    const frequencyControl = tobaccoForm.get('alcoholConsumptionFrequencyUuidConsumptionFrequency');

    if (value === true) {
      ageControl?.setValidators([Validators.required]);
      consumedControl?.setValidators([Validators.required]);
      if (consumedControl?.value === true) {
        frequencyControl?.setValidators([Validators.required]);
      }
    } else {
      ageControl?.clearValidators();
      consumedControl?.clearValidators();
      frequencyControl?.clearValidators();
    }

    ageControl?.updateValueAndValidity();
    consumedControl?.updateValueAndValidity();
    frequencyControl?.updateValueAndValidity();
  }

  get tobaccoForm(): FormGroup {
    return this.parentForm.get('tobaccoAlcohol') as FormGroup;
  }

  tobaccoConsumption = [
    {key: 1, label: 'Fumeur'},
    {key: 2, label: 'Non-fumeur'},
    {key: 3, label: 'Ex-fumeur'}
  ];

  showCigarettesFields(): boolean {
    const smokingStatus = this.tobaccoForm.get('tobaccoConsumption')?.value;
    return smokingStatus === 1 || smokingStatus === 3;
  }

  showCigarettesFieldsIfSmoker(): boolean {
    const smokingStatus = this.tobaccoForm.get('tobaccoConsumption')?.value;
    return smokingStatus === 1;
  }

  showConsumptionFrequencyTypeSmoker(): boolean {
    return this.tobaccoForm.get('tobaccoConsumedWithinThirtyDays')?.value === true;
  }

  showConsumptionFrequencyTypeAlcohol(): boolean {
    return this.tobaccoForm.get('alcoholConsumedWithinThirtyDays')?.value === true;
  }

  showCigarettesFieldsIfExSmoker(): boolean {
    const smokingStatus = this.tobaccoForm.get('tobaccoConsumption')?.value;
    return smokingStatus === 3;
  }

  showAlcoholFields(): boolean {
    return this.tobaccoForm.get('alcoholConsumption')?.value === true;
  }

  consumptionFrequencyType1!: ConsumptionFrequencyDto[] | null;

  getConsumptionFrequencyDtoListWithType1(): void {
    this.isLoading = true;
    this.drugRequestService.getConsumptionFrequencyDtoListWithType1().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.consumptionFrequencyType1 = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
