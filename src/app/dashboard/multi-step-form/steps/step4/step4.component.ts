import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrugRequestService } from '../../../../core/services/drug-request.service';
import { UsualRouteOfAdministrationDto } from '../../../../core/models/demanddrugs/UsualRouteOfAdministrationDto.model';
import { ConsumptionFrequencyDto } from '../../../../core/models/demanddrugs/ConsumptionFrequencyDto.model';
import { NotionOfSyringeSharingDrugsDto } from '../../../../core/models/demanddrugs/NotionOfSyringeSharingDto.model';
import { TriedToQuitDto } from '../../../../core/models/demanddrugs/TriedToQuitDto.model';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step4.component.html',
  styleUrl: './step4.component.css'
})
export class Step4Component implements OnInit {
  @Input() parentForm!: FormGroup;
  public usualRouteOptions: UsualRouteOfAdministrationDto[] = [];
  public consumptionFrequencyOptions: ConsumptionFrequencyDto[] = [];
  public syringeSharingOptions: NotionOfSyringeSharingDrugsDto[] = [];
  public triedToQuitOptions: TriedToQuitDto[] = [];
  public isLoading = false;

  public testPeriods: Array<{value: string, label: string}> = [
    { value: '3months', label: '3 mois' },
    { value: '6months', label: '6 mois' },
    { value: '12months', label: '12 mois ou plus' }
  ];

  public testResults = [
    'Positif',
    'Négatif',
    'Inconnu'
  ];

  constructor(private drugRequestService: DrugRequestService) {}

  ngOnInit() {
    this.getUsualRouteOfAdministrationList();
    this.getConsumptionFrequencyList();
    this.getNotionOfSyringeSharingList();
    this.getTriedToQuitList();
    this.setupValidation();
  }

  get behaviorsForm(): FormGroup {
    return this.parentForm.get('behaviorsAndTests') as FormGroup;
  }

  private setupValidation() {
    // Set required validators for test fields
    const testFields = ['vihTest', 'vhcTest', 'vhbTest'];
    testFields.forEach(field => {
      const control = this.behaviorsForm.get(field);
      if (control) {
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      }
    });

    // VIH test date validation
    this.behaviorsForm.get('vihTest')?.valueChanges.subscribe(value => {
      const dateControl = this.behaviorsForm.get('dateVihTest');
      if (value === true) {
        dateControl?.setValidators([Validators.required]);
      } else {
        dateControl?.clearValidators();
        dateControl?.setValue(null);
      }
      dateControl?.updateValueAndValidity();
    });

    // VHC test date validation
    this.behaviorsForm.get('vhcTest')?.valueChanges.subscribe(value => {
      const dateControl = this.behaviorsForm.get('dateVhcTest');
      if (value === true) {
        dateControl?.setValidators([Validators.required]);
      } else {
        dateControl?.clearValidators();
        dateControl?.setValue(null);
      }
      dateControl?.updateValueAndValidity();
    });

    // VHB test date validation
    this.behaviorsForm.get('vhbTest')?.valueChanges.subscribe(value => {
      const dateControl = this.behaviorsForm.get('dateVhbTest');
      if (value === true) {
        dateControl?.setValidators([Validators.required]);
      } else {
        dateControl?.clearValidators();
        dateControl?.setValue(null);
      }
      dateControl?.updateValueAndValidity();
    });

    // Route administration validation
    this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration')?.valueChanges.subscribe(answers => {
      if (Array.isArray(answers)) {
        const hasOther = answers.some((answer, index) =>
            this.usualRouteOptions[index]?.uuidUsualRouteOfAdministration === -1 && answer === true
        );

        const otherControl = this.behaviorsForm.get('otherUsualRouteOfAdministrationOfPrincipalSubstance');
        if (hasOther) {
          otherControl?.setValidators([Validators.required]);
        } else {
          otherControl?.clearValidators();
          otherControl?.setValue('');
        }
        otherControl?.updateValueAndValidity();

        // Validate that all options are answered
        if (!this.areAllRouteOptionsAnswered()) {
          this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration')?.setErrors({ incomplete: true });
        }
      }
    });

    // Age validation
    const ageControl = this.behaviorsForm.get('ageOfConsumptionOfPrincipalSubstance');
    if (ageControl) {
      ageControl.setValidators([Validators.required, Validators.min(1)]);
      ageControl.updateValueAndValidity();
    }

    // Frequency validation
    const frequencyControl = this.behaviorsForm.get('usualRouteOfAdministrationFrequencyOfPrincipalSubstanceUuidConsumptionFrequency');
    if (frequencyControl) {
      frequencyControl.setValidators([Validators.required]);
      frequencyControl.updateValueAndValidity();
    }

    // Syringe sharing validation
    const syringeSharingControl = this.behaviorsForm.get('notionOfSyringeSharingUuidNotionOfSyringeSharing');
    if (syringeSharingControl) {
      syringeSharingControl.setValidators([Validators.required]);
      syringeSharingControl.updateValueAndValidity();
    }

    // Add validation for weaning support fields
    this.behaviorsForm.get('supportForWeaning')?.setValidators([Validators.required]);
    this.behaviorsForm.get('supportForWeaning')?.updateValueAndValidity();

    // Add conditional validation for why not support
    this.behaviorsForm.get('supportForWeaning')?.valueChanges.subscribe(value => {
      const whyNotControl = this.behaviorsForm.get('whyNotSupportForWeaning');
      if (value === false) {
        whyNotControl?.setValidators([Validators.required]);
      } else {
        whyNotControl?.clearValidators();
        whyNotControl?.setValue('');
      }
      whyNotControl?.updateValueAndValidity();
    });

    // Add validation for tried to quit fields
    this.behaviorsForm.get('triedToQuit')?.setValidators([Validators.required]);
    this.behaviorsForm.get('triedToQuit')?.updateValueAndValidity();

    // Add conditional validation for quit attempt details
    this.behaviorsForm.get('triedToQuit')?.valueChanges.subscribe(value => {
      const withWhoControl = this.behaviorsForm.get('withWhoTriedToQuitUuidTriedToQuit');
      if (value === true) {
        withWhoControl?.setValidators([Validators.required]);
      } else {
        withWhoControl?.clearValidators();
        withWhoControl?.setValue(null);
        // Clear health structure field when tried to quit is false
        this.behaviorsForm.get('healthStructureTriedToQuit')?.setValue('');
      }
      withWhoControl?.updateValueAndValidity();
    });

    // Add conditional validation for health structure
    this.behaviorsForm.get('withWhoTriedToQuitUuidTriedToQuit')?.valueChanges.subscribe(values => {
      const healthStructureControl = this.behaviorsForm.get('healthStructureTriedToQuit');
      if (Array.isArray(values) && values.includes(5)) { // Assuming 5 is the ID for health structure option
        healthStructureControl?.setValidators([Validators.required]);
      } else {
        healthStructureControl?.clearValidators();
        healthStructureControl?.setValue('');
      }
      healthStructureControl?.updateValueAndValidity();
    });
  }

  private getTriedToQuitList() {
    this.isLoading = true;
    this.drugRequestService.getTriedToQuitDto().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.triedToQuitOptions = response.body;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private getUsualRouteOfAdministrationList() {
    this.isLoading = true;
    this.drugRequestService.getUsualRouteOfAdministrationDtoList().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.usualRouteOptions = response.body;
          this.initializeRouteAnswers();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private getConsumptionFrequencyList() {
    this.isLoading = true;
    this.drugRequestService.getConsumptionFrequencyDtoListWithType2().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.consumptionFrequencyOptions = response.body;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private getNotionOfSyringeSharingList() {
    this.isLoading = true;
    this.drugRequestService.getNotionOfSyringeSharingDtoList().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.syringeSharingOptions = response.body;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private initializeRouteAnswers() {
    if (!this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration')?.value) {
      const answers = new Array(this.usualRouteOptions.length).fill(null);
      this.behaviorsForm.patchValue({
        usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration: answers
      });

      // Set validators for the route administration control
      const routeControl = this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration');
      if (routeControl) {
        routeControl.setValidators([Validators.required]);
        routeControl.updateValueAndValidity();
      }
    }
  }

  public onRouteChange(index: number, selected: boolean) {
    const answers = [...(this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration')?.value || [])];
    answers[index] = selected;
    this.behaviorsForm.patchValue({
      usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration: answers
    });

    const option = this.usualRouteOptions[index];
    if (option && option.uuidUsualRouteOfAdministration === -1) {
      if (selected) {
        this.behaviorsForm.get('otherUsualRouteOfAdministrationOfPrincipalSubstance')?.setValidators([Validators.required]);
      } else {
        this.behaviorsForm.get('otherUsualRouteOfAdministrationOfPrincipalSubstance')?.clearValidators();
        this.behaviorsForm.get('otherUsualRouteOfAdministrationOfPrincipalSubstance')?.setValue('');
      }
      this.behaviorsForm.get('otherUsualRouteOfAdministrationOfPrincipalSubstance')?.updateValueAndValidity();
    }

    // Check if all options are answered
    if (this.areAllRouteOptionsAnswered()) {
      this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration')?.setErrors(null);
    } else {
      this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration')?.setErrors({ incomplete: true });
    }
  }

  public handleFrequencyChange(event: Event, value: number) {
    const checkbox = event.target as HTMLInputElement;
    const frequencyControl = this.behaviorsForm.get('usualRouteOfAdministrationFrequencyOfPrincipalSubstanceUuidConsumptionFrequency');

    if (checkbox.checked) {
      // Uncheck all other checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.startsWith('frequency-')) {
          cb.checked = false;
        }
      });
      frequencyControl?.setValue(value);
    } else {
      frequencyControl?.setValue(null);
    }
  }

  public handleSyringeSharingChange(event: Event, value: number) {
    const checkbox = event.target as HTMLInputElement;
    const syringeSharingControl = this.behaviorsForm.get('notionOfSyringeSharingUuidNotionOfSyringeSharing');

    if (checkbox.checked) {
      // Uncheck all other checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.startsWith('syringe-sharing-')) {
          cb.checked = false;
        }
      });
      syringeSharingControl?.setValue(value);
    } else {
      syringeSharingControl?.setValue(null);
    }
  }

  public areAllRouteOptionsAnswered(): boolean {
    const answers = this.behaviorsForm.get('usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration')?.value;
    return answers?.every((answer: boolean | null) => answer !== null) ?? false;
  }

  public handleTriedToQuitOptionChange(event: Event, value: number) {
    const checkbox = event.target as HTMLInputElement;
    const currentValues = this.behaviorsForm.get('withWhoTriedToQuitUuidTriedToQuit')?.value || [];

    if (checkbox.checked) {
      if (!currentValues.includes(value)) {
        this.behaviorsForm.patchValue({
          withWhoTriedToQuitUuidTriedToQuit: [...currentValues, value]
        });
      }
    } else {
      this.behaviorsForm.patchValue({
        withWhoTriedToQuitUuidTriedToQuit: currentValues.filter((v: number) => v !== value)
      });

      // If unchecking health structure option, clear the health structure field
      if (value === 5) {
        this.behaviorsForm.get('healthStructureTriedToQuit')?.setValue('');
      }
    }
  }
}

export { Step4Component }